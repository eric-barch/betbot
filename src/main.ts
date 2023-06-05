import { prisma } from '@/db';
import { allPageParsers } from '@/parsers';

async function main() {
  await allPageParsers.init();
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })