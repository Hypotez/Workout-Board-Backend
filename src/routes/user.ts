import { Router } from 'express';
import { attachUserId } from '../middleware/middleware';

const router = Router();

router.post('/', async (req, res): Promise<void> => {
  res.success({ message: 'User route is working' });
});

router.get('/me', attachUserId, async (req, res): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    return res.error('Unauthorized', 401);
  }

  const user = await req.service.db.getUserById(userId);
  if (!user) {
    return res.error('User not found', 404);
  }

  res.success(user);
});

export default router;
