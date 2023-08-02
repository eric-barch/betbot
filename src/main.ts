import { prisma } from '@/db';
import { AllPageParsers } from '@/parsers/global';

async function main() {
  let running = true;
  process.on('SIGINT', () => running = false);

  const allPageParsers = await AllPageParsers.init();

  while (running) {
    await allPageParsers.update();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await allPageParsers.disconnect();
  await prisma.$disconnect();
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exit(1);
  });