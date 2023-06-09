import { prisma } from '@/db';
import { allPageParsers } from '@/parsers';

async function main() {
  await allPageParsers.init();

  while (true) {
    const start = Date.now();
    await allPageParsers.updateOddData();
    const end = Date.now();

    console.log(`Updated in ${end - start}ms`);
    await delay(500);
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}