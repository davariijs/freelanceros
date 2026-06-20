import { Router } from 'express';
import { prisma } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { title, content } = req.body;
  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: req.userId!,
    },
  });
  return res.status(201).json(note);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.userId! },
    orderBy: { updatedAt: 'desc' },
  });
  return res.status(200).json(notes);
});

export { router as noteRouter };
