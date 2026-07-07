import cron from 'node-cron';
import { prisma } from '@freelanceos/database';
import { emailService } from './emailService';

export const cronService = {
  start(): void {
    cron.schedule('0 0 9 * * *', async () => {
      console.log('[Cron Job]: Starting daily project deadline scan...');

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowProjects = await prisma.project.findMany({
          where: {
            dueDate: {
              gte: tomorrow,
              lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            },
            status: { not: 'COMPLETED' },
          },
          include: { user: true },
        });

        for (const project of tomorrowProjects) {
          const existingLog = await prisma.activityLog.findFirst({
            where: {
              action: 'PROJECT_DEADLINE_TOMORROW',
              userId: project.userId,
              metadata: { contains: project.id },
              createdAt: { gte: today },
            },
          });

          if (!existingLog) {
            await prisma.activityLog.create({
              data: {
                action: 'PROJECT_DEADLINE_TOMORROW',
                metadata: JSON.stringify({
                  projectId: project.id,
                  title: project.title,
                }),
                userId: project.userId,
              },
            });

            try {
              await emailService.sendProjectDeadlineWarning(
                project.user.email,
                project.title,
                true,
              );
            } catch (emailError) {
              console.error(
                `[Cron Job Error]: Failed to send tomorrow warning email for project ${project.title}:`,
                emailError,
              );
            }
          }
        }

        const todayProjects = await prisma.project.findMany({
          where: {
            dueDate: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            status: { not: 'COMPLETED' },
          },
          include: { user: true },
        });

        for (const project of todayProjects) {
          const existingLog = await prisma.activityLog.findFirst({
            where: {
              action: 'PROJECT_DEADLINE_TODAY',
              userId: project.userId,
              metadata: { contains: project.id },
              createdAt: { gte: today },
            },
          });

          if (!existingLog) {
            await prisma.activityLog.create({
              data: {
                action: 'PROJECT_DEADLINE_TODAY',
                metadata: JSON.stringify({
                  projectId: project.id,
                  title: project.title,
                }),
                userId: project.userId,
              },
            });

            try {
              await emailService.sendProjectDeadlineWarning(
                project.user.email,
                project.title,
                false,
              );
            } catch (emailError) {
              console.error(
                `[Cron Job Error]: Failed to send today warning email for project ${project.title}:`,
                emailError,
              );
            }
          }
        }

        console.log(
          `[Cron Job]: Scan completed. Tommorow: ${tomorrowProjects.length}, Today: ${todayProjects.length}`,
        );
      } catch (error) {
        console.error(
          '[Cron Job]: Failed to run project deadline scan:',
          error,
        );
      }
    });
  },
};
