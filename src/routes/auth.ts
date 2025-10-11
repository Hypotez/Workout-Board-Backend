import { clearCookies, setCookies } from '../crypto/jwt';
import { CreateUserSchema, LoginUserSchema } from '../schemas/shared/auth';
import { cookieAuth } from '../middleware/middleware';
import { Router } from 'express';
import logger from '../logger/logger';

const router = Router();

router.post('/register', async (req, res): Promise<void> => {
  const user = CreateUserSchema.safeParse(req.body);

  if (!user.success) {
    logger.error('[/register] Invalid user data');
    return res.error();
  }

  const cookie = await req.service.db.createUser({
    username: user.data.username,
    password: user.data.password,
    email: user.data.email,
  });
  if (cookie) {
    await setCookies(res, cookie);
    return res.success();
  }

  logger.error('[/register] Could not create user');
  res.error();
});

router.post('/login', async (req, res): Promise<void> => {
  const login = LoginUserSchema.safeParse(req.body);

  if (!login.success) {
    res.error('Invalid data');
    return;
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

  res.error('Invalid username, email or password', 401);
});

router.post('/logout', async (_, res): Promise<void> => {
  clearCookies(res);
  return res.success();
});

router.get('/validate', cookieAuth, async (_, res): Promise<void> => {
  return res.success();
});

export default router;
