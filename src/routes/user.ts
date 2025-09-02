import { Router } from 'express'
import { UuidType } from '../schemas/shared/common'

const router = Router()

router.post('/', async (req, res): Promise<void> => {
    res.success({ message: 'User route is working' })
})

export default router