import { Database, OPEN_READWRITE, RunResult } from 'sqlite3'
import { PaginationDto } from './dto'
import { logger } from '@src/utils'
import { readFileSync } from 'fs'

class Sqlite3Service extends Database {
    // used to paginate
    getLimitOffsetFromQuery(query?: PaginationDto) {
        query = Object.assign({}, { page: 1, itemsPerPage: 10 }, query)

        const page = +query.page!
        const limit = +query.itemsPerPage!
        let offset = 0
        if (page !== 1) {
            offset = (page - 1) * limit
        }

        return { limit, offset }
    }

    runAsync(sql: string, params: any = undefined) {
        return new Promise((resolve, reject) => {
            super.run(sql, params, (_: RunResult, err: Error | null) => {
                if (err) {
                    reject(err)
                }
                resolve(null)
            })
        })
    }

    getAsync<T>(sql: string, params: any = undefined) {
        return new Promise<T>((resolve, reject) => {
            super.get<T>(sql, params, (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve(row)
            })
        })
    }

    allAsync<T>(sql: string, params: any = undefined) {
        return new Promise<T[]>((resolve, reject) => {
            super.all<T>(sql, params, (err, row) => {
                if (err) {
                    reject(err)
                }
                resolve(row)
            })
        })
    }
}

const sqlite3Service = new Sqlite3Service(':memory:', OPEN_READWRITE, (err) => {
    if (err) {
        logger.error(`Unexpected error on SQLite: ${err}`)
        process.exit(-1)
    }
})

function runMigrations() {
    logger.info('Running migrations...')
    const sql = readFileSync('./migrations/migration.sql', { encoding: 'utf-8' })
    sqlite3Service.exec(sql)
    logger.info('Done.')
}

runMigrations()
export { sqlite3Service }