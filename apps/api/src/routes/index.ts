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

router.use('/auth', authRouter);
router.use('/clients', clientRouter);
router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/notes', noteRouter);
router.use('/activity-logs', activityRouter);
router.use('/shared', sharedRouter);

export { router as apiRoutes };
