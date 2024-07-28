import { sqlite3Service } from '@src/sqlite'
import { PaginationDto } from '@src/sqlite/dto'
import { CreateTaskDto, UpdateTaskDto } from './dto'
import { TaskModel } from './model'
import { throwValidationError } from '@src/utils'


async function findMany(query?: PaginationDto) {
    const { limit, offset } = sqlite3Service.getLimitOffsetFromQuery(query)
    const sql = 'SELECT id, description, createdAt, updatedAt FROM tasks LIMIT $limit OFFSET $offset'
    const values = {
        $limit: limit,
        $offset: offset
    }

    return (await sqlite3Service.allAsync<TaskModel>(sql, values))
}

async function findOne(id: string) {
    const sql = 'SELECT id, description, createdAt, updatedAt FROM tasks WHERE id = $id'
    const values = {
        $id: id,
    }
    return (await sqlite3Service.getAsync<TaskModel>(sql, values))
}

async function create(body: CreateTaskDto) {
    const sql = 'INSERT INTO tasks (description) VALUES ($description) RETURNING id, description, createdAt, updatedAt'
    const values = {
        $description: body.description
    }
    return (await sqlite3Service.getAsync<TaskModel>(sql, values))
}

async function update(id: string, body: UpdateTaskDto) {
    let queryBuild = ['UPDATE tasks']
    let values: any[] = []

    if (Object.keys(body).length > 0) {
        queryBuild.push('SET')
        let index = 1
        for (const [key, value] of Object.entries(body)) {
            // comma needed after pair of key/value but not before WHERE clause
            const comma = index !== Object.keys(body).length ? ',' : ''

            queryBuild.push(`"${key}" = ?${comma}`)
            values.push(value)
            index++
        }
    } else {
        throwValidationError('Um campo ao menos deve ser atualizado', ['description'])
    }
    queryBuild.push(`WHERE id = ? RETURNING id, description, createdAt, updatedAt`)
    values.push(id)

    return (await sqlite3Service.getAsync<TaskModel>(queryBuild.join(' '), values))
}

async function remove(id: string) {
    const sql = 'DELETE FROM tasks WHERE id = $id'
    const values = {
        $id: id
    }

    await sqlite3Service.runAsync(sql, values)
    return null
}

export const TasksService = { findMany, findOne, create, update, remove }