import * as db from './db';

async function main() {
  await db.activeExchanges.init();
  await db.activeLeagues.init();
  await db.activeTeams.init();
}

main()
  .then(async () => {
    await db.prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.prisma.$disconnect()
    process.exit(1)
  })