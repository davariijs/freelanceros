import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { title, content, taskId } = req.body;
  const note = await prisma.note.create({
    data: {
      title,
      content,
      taskId: taskId === 'NONE' || !taskId ? null : taskId,
      userId: req.userId!,
    },
  });
  return res.status(201).json(note);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.userId! },
    include: { task: true },
    orderBy: { updatedAt: 'desc' },
  });
  return res.status(200).json(notes);
});

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, content, taskId } = req.body;
  const note = await prisma.note.update({
    where: { id, userId: req.userId! },
    data: {
      title: title || undefined,
      content: content !== undefined ? content : undefined,
      taskId: taskId === 'NONE' ? null : taskId || undefined,
    },
  });
  return res.status(200).json(note);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.note.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as noteRouter };
