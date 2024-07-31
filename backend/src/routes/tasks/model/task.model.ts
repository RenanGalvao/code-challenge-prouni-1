export class TaskModel {
    id: number
    description: string
    done: number
    createdAt: string
    updatedAt: string | null

    constructor(task: TaskModel) {
        this.id = task.id
        this.description = task.description
        this.done = task.done
        this.createdAt = task.createdAt
        this.updatedAt = task.updatedAt
    }
}