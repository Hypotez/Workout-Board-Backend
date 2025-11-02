import { Router } from 'express';
import { attachUserId } from '../middleware/middleware';
import { SettingsSchema } from '../schemas/shared/settings';
import logger from '../logger/logger';

const router = Router();

router.post('/', attachUserId, async (req, res): Promise<void> => {
  const userId = req.userId!;

  const settings = SettingsSchema.safeParse(req.body);

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
  const userId = req.userId!;

  const settings = await req.service.db.getUserSettings(userId);
  if (!settings) {
    return res.error('Failed to fetch settings', 500);
  }

  res.success(settings);
});

export default router;
