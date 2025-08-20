import { Router } from 'express'
import logger from '../logger/logger'

const router = Router()

router.post('/', async (req, res): Promise<void> => {
    req.service.hevyClient.getWorkouts(1, 10)
    res.success({ message: 'User route is working' })
})

export default router