import { Server } from 'http'
import { logger } from '@/utils/index.js'

function tasks(server: Server, signal: string) {
    logger.info(`${signal} signal received.`)
    server.close(() => {
        process.exit(0)
    })
}

export function gracefulShutdown(server: Server) {
    process.on('SIGTERM', () => {
        tasks(server, 'SIGTERM')
    })

    process.on('SIGINT', () => {
        tasks(server, 'SIGINT')
    })
}

