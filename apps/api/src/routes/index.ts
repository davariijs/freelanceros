import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';
import { clientRouter } from '@/routes/client.routes';
import { projectRouter } from '@/routes/project.routes';
import { taskRouter } from '@/routes/task.routes';
import { noteRouter } from '@/routes/note.routes';
import { activityRouter } from '@/routes/activity.routes';
import { sharedRouter } from '@/routes/shared.routers';

const router: Router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/cron/notifications', async (req, res) => {
  const cronKey = req.headers['x-cron-key'] || req.query.key;
  const expectedKey = process.env.CRON_SECRET;

  if (expectedKey && cronKey !== expectedKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    return res
      .status(200)
      .json({ success: true, message: 'Cron tasks executed successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.use('/auth', authRouter);
router.use('/clients', clientRouter);
router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/notes', noteRouter);
router.use('/activity-logs', activityRouter);
router.use('/shared', sharedRouter);

export { router as apiRoutes };
