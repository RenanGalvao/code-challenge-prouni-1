export class TaskModel {
    id: string
    description: string
    createdAt: string
    updatedAt: string | null

    constructor(task: TaskModel) {
        this.id = task.id
        this.description = task.description
        this.createdAt = task.createdAt
        this.updatedAt = task.updatedAt
    }
}