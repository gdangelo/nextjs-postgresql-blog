// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'PUT':
      try {
        const { id } = req.query;
        const post = await prisma.post.update({
          where: {
            id: String(id),
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        });
        res.status(200).json(post);
      } catch (err) {
        console.error('Request error', err);
        res.status(500).json({ error: 'Error updating likes' });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
