import { prisma } from '@/db';
import { allPageParsers } from '@/parsers';

async function main() {
  const startTime = new Date();
  await allPageParsers.init();
  const endTime = new Date();

  const duration = endTime.getTime() - startTime.getTime();

  console.log(`Duration: ${duration} ms\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await allPageParsers.disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await allPageParsers.disconnect();
    process.exit(1);
  })