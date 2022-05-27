// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { posts } from '@/lib/data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await prisma.post.deleteMany();
    const payload = await prisma.post.createMany({
      data: posts,
    });
    res.status(200).json(payload);
  } catch (err) {
    console.error('Request error', err);
    res.status(500).json({ error: 'Error resetting posts' });
  }
}
