import { prisma } from '@/db';
import { AllPageParsers } from '@/parsers/global';

async function main() {
  const allPageParsers = await AllPageParsers.getInstance();

  let running = true;

  process.on('SIGINT', () => running = false);

  while (running) {
    await allPageParsers.update();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\nStopping betbot...`);

  await allPageParsers.disconnect();
  await prisma.$disconnect();
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exit(1);
  });