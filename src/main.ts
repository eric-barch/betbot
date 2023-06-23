import { prisma } from '@/db';
import { AllPageParsers } from '@/parsers/global';

async function main() {
  const allPageParsers = await AllPageParsers.create();

  while (true) {
    await allPageParsers.updateOdds();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await allPageParsers.disconnect();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });