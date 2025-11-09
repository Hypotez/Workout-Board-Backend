import { Router } from 'express';

const router = Router();

router.get('/me', async (req, res): Promise<void> => {
  const userId = req.userId!;

  const user = await req.service.db.getUserById(userId);
  if (!user) {
    return res.error('User not found', 404);
  }

  res.success(user);
});

export default router;
