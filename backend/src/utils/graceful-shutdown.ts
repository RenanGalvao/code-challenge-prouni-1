import { Server } from 'http'
import { logger } from '@src/utils'
import { sqlite3Service } from '@src/sqlite'

function tasks(server: Server, signal: string) {
    logger.info(`${signal} signal received.`)
    server.close(() => {
        try {
            logger.info('Closing Sqlite3 connection.')
            sqlite3Service.close((err) => {
                logger.warn(`When closing Sqlite3 error: ${err}`)
            })
        } finally {
            process.exit(0)
        }
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

