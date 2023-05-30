import { config } from '@/config';
import { PageParserFactory } from '@/page-parsers';
import * as db from '@/db';

async function main() {
  for (const exchangeKey in config) {
    const exchangeObject = config[exchangeKey as keyof typeof config];

    for (const leagueKey in exchangeObject) {
      const leagueObject = exchangeObject[leagueKey as keyof typeof exchangeObject];

      for (const pageKey in leagueObject) {
        // Get page parser, which will initiate database objects as part of its own initiation.
        // Think this is necessary for full extensibility to the general page parser.
        const url = leagueObject[pageKey as keyof typeof leagueObject];
        await PageParserFactory.create({ url });
      }
    }
  }
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