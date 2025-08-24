import { Router } from 'express'
import logger from '../logger/logger'

const router = Router()

router.post('/', async (req, res): Promise<void> => {
    const workout = await req.service.hevyClient.getWorkouts(1, 1)
    res.success({ message: 'User route is working' })
})

export default router