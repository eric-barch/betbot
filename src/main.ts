import { prisma } from '@/db';
import { allPageParsers } from '@/parsers';

async function main() {
  await allPageParsers.init();

  while (true) {
    await allPageParsers.updateOddData();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
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
  });