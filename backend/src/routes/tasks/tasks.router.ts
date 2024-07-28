import { Router } from 'express'
import { TasksController } from './tasks.controller'
import { ValidateParam, ValidateBody, ValidateQuery } from '@src/middlewares'
import { PaginationDto } from '@src/sqlite/dto'
import { CreateTaskDto, UpdateTaskDto } from './dto'
import { idParam } from '@src/const'


const baseRoute = 'tasks'
const router = Router()

router.get(`/${baseRoute}`, ValidateQuery(PaginationDto), TasksController.findMany)
router.get(`/${baseRoute}/:id`, ValidateParam('id', idParam), TasksController.findOne)
router.post(`/${baseRoute}`, ValidateBody(CreateTaskDto), TasksController.create)
router.put(`/${baseRoute}/:id`, ValidateParam('id', idParam), ValidateBody(UpdateTaskDto), TasksController.update)
router.delete(`/${baseRoute}/:id`, ValidateParam('id', idParam), TasksController.remove)

export const TasksRouter = router