import { prisma } from '@/db';
import { allPageParsers } from '@/page-parsers';

async function main() {
  await allPageParsers.initFromConfig();
  await allPageParsers.update();
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