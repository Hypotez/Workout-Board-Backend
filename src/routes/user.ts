import { Router } from 'express'
import logger from '../logger/logger'

const router = Router()

router.post('/', async (req, res): Promise<void> => {
    logger.info('Login request received')
    res.status(200).send('Ok')
})

export default router