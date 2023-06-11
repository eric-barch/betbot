import { Odd } from '@prisma/client';

import { prisma } from '@/db';
import { DbOddInitializer, OddButtonParser } from '@/parsers/models/shared-models';

export class DraftKingsDbOddInitializer extends DbOddInitializer {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsDbOddInitializer> {
    const draftKingsdbOddInitializer = new DraftKingsDbOddInitializer({ parentOddButtonParser });
    await draftKingsdbOddInitializer.init();
    return draftKingsdbOddInitializer;
  }

  protected async updateDbOdd(): Promise<Odd> {
    const exchangeId = this.parentOddButtonParser.exchange.id;
    const statisticId = this.parentOddButtonParser.statistic.id;

    this.odd = await prisma.odd.upsert({
      where: {
        exchangeId_statisticId: {
          exchangeId,
          statisticId,
        },
      },
      update: {},
      create: {
        exchangeId,
        statisticId,
      },
    });

    return this.odd;
  }
}