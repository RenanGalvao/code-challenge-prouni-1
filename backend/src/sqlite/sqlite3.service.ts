import { Database, OPEN_READWRITE, RunResult } from 'sqlite3'
import { PaginationDto } from './dto'
import { logger } from '@src/utils'
import { readFileSync } from 'fs'

class Sqlite3Service extends Database {
    // used to paginate
    private getLimitOffsetFromQuery(query?: PaginationDto) {
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

    findManyAsync<T>(sql: string, query?: PaginationDto) {
        return new Promise<{ data: T[]; totalCount: number; totalPages: number }>((resolve, reject) => {
            super.serialize(async () => {
                // table is the last word in the sql query (should be)
                const originalTable = sql.substring(sql.indexOf('FROM') + ('FROM'.length)).trim()
                const totalCountQuery = `SELECT COUNT(*) as totalCount FROM ${originalTable}`
                const { totalCount } = await this.getAsync<{ totalCount: number }>(totalCountQuery)

                // Append LIMIT
                sql += ' LIMIT $limit OFFSET $offset'

                // LIMIT and OFFSET (pagination) params
                const { limit, offset } = this.getLimitOffsetFromQuery(query)
                const params = {
                    $limit: limit,
                    $offset: offset
                }

                // actual data
                super.all<T>(sql, params, (err, rows) => {
                    if (err) {
                        reject(err)
                    }

                    // ensures 1 as min totalPages
                    const totalPages = Math.max(Math.ceil(totalCount / limit), 1)
                    resolve({ data: rows, totalCount, totalPages })
                })
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