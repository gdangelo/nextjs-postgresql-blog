import { PrismaClient } from '@prisma/client';
import { posts } from '../lib/data';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: posts,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
