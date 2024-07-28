import { Request, Response, NextFunction } from 'express'
import { TasksService } from './tasks.service'
import { formatResponse } from '@src/utils'

async function findMany(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(formatResponse(req, res, await TasksService.findMany(req.query)))
    } catch (err) {
        next(err)
    }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(formatResponse(req, res, await TasksService.findOne(req.params.id)))
    } catch (err) {
        next(err)
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(201).json(formatResponse(req, res, await TasksService.create(req.body)))
    } catch (err) {
        next(err)
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(formatResponse(req, res, await TasksService.update(req.params.id, req.body)))
    } catch (err) {
        next(err)
    }
}

async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(formatResponse(req, res, await TasksService.remove(req.params.id)))
    } catch (err) {
        next(err)
    }
}

export const TasksController = { findMany, findOne, create, update, remove }