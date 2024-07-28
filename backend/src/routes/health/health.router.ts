import { Router } from 'express'
import { HealthController } from './health.controller'

const baseRoute = 'health'
const router = Router()

router.get(`/${baseRoute}`, HealthController.health)

export const HealthRouter = router