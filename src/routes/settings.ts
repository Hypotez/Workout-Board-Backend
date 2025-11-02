import { Router } from 'express';
import { attachUserId } from '../middleware/middleware';
import { SaveSettingsSchema } from '../schemas/shared/settings';
import logger from '../logger/logger';

const router = Router();

router.post('/', attachUserId, async (req, res): Promise<void> => {
  const userId = req.userId!;

  const settings = SaveSettingsSchema.safeParse(req.body);

  if (!settings.success) {
    logger.error('[/settings] Invalid settings data');
    return res.error();
  }

  const saveSettings = await req.service.db.saveUserSettings(userId, settings.data);
  if (!saveSettings) {
    return res.error('Failed to save settings', 500);
  }
  res.success();
});

router.get('/', attachUserId, async (req, res): Promise<void> => {
  res.success({ message: 'User route is working' });
});

export default router;
