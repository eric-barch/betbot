import { DbOddConnection } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/db-connections/db-odd-connection';
import { DbUtilityFunctions, prisma } from '@/db';
import { OddButtonParser } from '@/parsers';
import { Odd } from '@prisma/client';

export class DraftKingsDbOddConnection extends DbOddConnection {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsDbOddConnection> {
    const dbOddConnection = new DraftKingsDbOddConnection({ parentOddButtonParser });
    await dbOddConnection.init();
    return dbOddConnection;
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