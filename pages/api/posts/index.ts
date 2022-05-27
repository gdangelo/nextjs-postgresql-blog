// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const posts = await prisma.post.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        });
        res.status(200).json(posts);
      } catch (err) {
        console.error('Request error', err);
        res.status(500).json({ error: 'Error fetching posts' });
      }
      break;
    case 'POST':
      try {
        const { title, excerpt, content } = req.body;
        const post = await prisma.post.create({
          data: {
            title,
            excerpt,
            content,
          },
        });
        res.status(200).json(post);
      } catch (err) {
        console.error('Request error', err);
        res.status(500).json({ error: 'Error creating post' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
