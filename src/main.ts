import { prisma } from '@/db';
import { AllPageParsers } from '@/parsers/global';

let running = true;

async function main() {
  const allPageParsers = await AllPageParsers.create();

  process.on('SIGINT', () => {
    running = false;
  });

  while (running) {
    await allPageParsers.updateOdds();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await allPageParsers.disconnect();
  await prisma.$disconnect();
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exit(1);
  });