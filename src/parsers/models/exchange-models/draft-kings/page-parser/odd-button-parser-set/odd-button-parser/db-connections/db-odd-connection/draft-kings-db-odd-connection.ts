import { DbOddConnection } from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser/db-connections/db-odd-connection';
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
    const exchange = this.parentOddButtonParser.exchange;
    const statistic = this.parentOddButtonParser.statistic;

    this.odd = await DbUtilityFunctions.findOrCreateOddByExchangeAndStatistic({
      exchange,
      statistic,
    });

    return this.odd;
  }
}