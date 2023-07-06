import { Odd, Statistic } from '@prisma/client';

import { GameWithTeams } from '@/db';
import {
  DbGameConnection, DbOddConnection, DbStatisticConnection, OddButtonParser
} from '@/parsers/models/common-models';

export class OddButtonParserDbConnection {
  private readonly parent: OddButtonParser;
  private wrappedDbGameConnection: DbGameConnection | undefined;
  private wrappedDbStatisticConnection: DbStatisticConnection | undefined;
  private wrappedDbOddConnection: DbOddConnection | undefined;

  private constructor({
    parent,
  }: {
    parent: OddButtonParser,
  }) {
    this.parent = parent;
  }

  public static async create({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<OddButtonParserDbConnection> {
    const dbConnection = new OddButtonParserDbConnection({ parent: parent });
    await dbConnection.init();
    return dbConnection;
  }

  private async init(): Promise<OddButtonParserDbConnection> {
    this.dbGameConnection = await this.parent.parent.parserFactory.createDbGameConnection({
      parent: this.parent,
    });

    this.dbStatisticConnection = await DbStatisticConnection.create({
      parentOddButtonParser: this.parent,
      game: this.dbGameConnection.game,
    });

    this.dbOddConnection = await DbOddConnection.create({
      parentOddButtonParser: this.parent,
      statistic: this.dbStatisticConnection.statistic,
    });

    return this;
  }

  public async update({
    price,
    value,
  }: {
    price: number | null,
    value: number | null,
  }): Promise<Odd> {
    return await this.dbOddConnection.update({
      price,
      value,
    });
  }

  public async disconnect(): Promise<void> {
    await this.dbOddConnection.disconnect();
  }

  public get game(): GameWithTeams {
    return this.dbGameConnection.game;
  }

  public get statistic(): Statistic {
    return this.dbStatisticConnection.statistic;
  }

  public get odd(): Odd {
    return this.dbOddConnection.odd;
  }

  private set dbGameConnection(dbGameConnection: DbGameConnection) {
    this.wrappedDbGameConnection = dbGameConnection;
  }

  private get dbGameConnection(): DbGameConnection {
    if (this.wrappedDbGameConnection === undefined) {
      throw new Error('wrappedDbGameConnection is undefined.');
    }

    return this.wrappedDbGameConnection;
  }

  private set dbStatisticConnection(dbStatisticConnection: DbStatisticConnection) {
    this.wrappedDbStatisticConnection = dbStatisticConnection;
  }

  private get dbStatisticConnection(): DbStatisticConnection {
    if (this.wrappedDbStatisticConnection === undefined) {
      throw new Error('wrappedDbStatisticConnection is undefined.');
    }

    return this.wrappedDbStatisticConnection;
  }

  private set dbOddConnection(dbOddConnection: DbOddConnection) {
    this.wrappedDbOddConnection = dbOddConnection;
  }

  private get dbOddConnection(): DbOddConnection {
    if (this.wrappedDbOddConnection === undefined) {
      throw new Error('wrappedDbOddConnection is undefined.');
    }

    return this.wrappedDbOddConnection;
  }
}