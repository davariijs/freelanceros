import { Router } from 'express';
import { prisma } from '@freelanceos/database';

const router: Router = Router();

router.get('/projects/:shareToken', async (req, res) => {
  const { shareToken } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: {
        shareToken,
        isShared: true,
      },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
        client: true,
      },
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Shared project not found or access disabled' });
    }

    return res.status(200).json(project);
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as sharedRouter };
