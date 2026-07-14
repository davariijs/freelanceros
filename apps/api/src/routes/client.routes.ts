import { Router } from 'express';
import { prisma, ClientStatus } from '@freelanceos/database';
import { authenticate, AuthenticatedRequest } from '@/middleware/auth';

const router: Router = Router();

router.use(authenticate);

router.post('/', async (req: AuthenticatedRequest, res) => {
  const { name, email, status, phone, website, socials } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const client = await tx.client.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        website: website || null,
        socials: socials || null,
        status: (status as ClientStatus) || 'ACTIVE',
        userId: req.userId!,
      },
    });

    await tx.activityLog.create({
      data: {
        action: 'CLIENT_CREATED',
        metadata: JSON.stringify({ name: client.name }),
        userId: req.userId!,
      },
    });

    return client;
  });

  return res.status(201).json(result);
});

router.get('/', async (req: AuthenticatedRequest, res) => {
  const clients = await prisma.client.findMany({
    where: { userId: req.userId! },
  });
  return res.status(200).json(clients);
});

router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { name, email, status, phone, website, socials } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const client = await tx.client.update({
      where: { id, userId: req.userId! },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        website: website || null,
        socials: socials || null,
        status: (status as ClientStatus) || undefined,
      },
    });

    if (status === 'INACTIVE') {
      await tx.project.updateMany({
        where: {
          clientId: id,
          userId: req.userId!,
          status: { not: 'COMPLETED' },
        },
        data: { status: 'PAUSED' },
      });
    }

    return client;
  });

  return res.status(200).json(result);
});

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await prisma.client.delete({
    where: { id, userId: req.userId! },
  });
  return res.status(204).send();
});

export { router as clientRouter };
