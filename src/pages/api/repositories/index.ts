import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { repositoryValidationSchema } from 'validationSchema/repositories';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRepositories();
    case 'POST':
      return createRepository();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRepositories() {
    const data = await prisma.repository
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'repository'));
    return res.status(200).json(data);
  }

  async function createRepository() {
    await repositoryValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.github_star?.length > 0) {
      const create_github_star = body.github_star;
      body.github_star = {
        create: create_github_star,
      };
    } else {
      delete body.github_star;
    }
    const data = await prisma.repository.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
