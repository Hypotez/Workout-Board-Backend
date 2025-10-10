import { setCookies, clearCookies } from '../crypto/jwt'
import { CreateUserSchema, LoginUserSchema } from '../schemas/shared/auth'
import { cookieAuth } from '../middleware/middleware'
import { Router } from 'express'


const router = Router()

router.post('/register', async (req, res): Promise<void> => {
    const user = CreateUserSchema.safeParse(req.body)

    if (!user.success) {
        res.error('Invalid data')
        return
    }

    /*
    TODO: Enable user registration
    const cookie = await req.service.db.createUser({ username: user.data.username, password: user.data.password, email: user.data.email })
    if (cookie) {
        await setCookies(res, cookie)
        res.success()
        return
    }
    */
    res.error('Could not create user', 400)
})

router.post('/login', async (req, res): Promise<void> => {
    const login = LoginUserSchema.safeParse(req.body)

    if (!login.success) {
        res.error('Invalid data')
        return
    }

    /*
    TODO: Enable user login
    const cookie = await req.service.db.login(login.data)
    if (cookie) {
        await setCookies(res, cookie)
        res.success()
        return
    }
    */

    res.error('Invalid username, email or password', 401)
})

router.post('/logout', async (_, res): Promise<void> => {
    clearCookies(res)
    return res.success()
})

router.get('/validate', cookieAuth, async (_, res): Promise<void> => {
    return res.success()
})

export default router