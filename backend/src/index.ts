// class-transformer shim required
import 'reflect-metadata'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from '@src/config'
import { HealthRouter } from '@src/routes/health'
import { TasksRouter } from '@src/routes/tasks'
import { RateLimiter, ExceptionHandler, Custom404 } from '@src/middlewares'
import { logger, appInitLog } from '@src/utils'

const app = express()

// Security
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
    exposedHeaders: [
        'X-Total-Count', 'X-Total-Pages',
        'Retry-After', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'
    ]
}))

// Midlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(RateLimiter)

// Routes
app.use(HealthRouter)
app.use(TasksRouter)

app.use(Custom404)
app.use(ExceptionHandler)

const server = app.listen(config.app.port, () => {
    appInitLog(app._router)
    logger.info(`Server is running at http://localhost:${config.app.port}`)
})