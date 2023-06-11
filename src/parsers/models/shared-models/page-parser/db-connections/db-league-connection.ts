import { League } from '@prisma/client';

import { DbUtilityFunctions, prisma } from '@/db';
import { LeagueInitData } from '@/setup';

export class DbLeague {
  private initData: LeagueInitData;
  private wrappedLeague: League | undefined;

  private constructor({
    initData,
  }: {
    initData: LeagueInitData,
  }) {
    this.initData = initData;
  }

  public static async create({
    initData,
  }: {
    initData: LeagueInitData,
  }): Promise<DbLeague> {
    const dbLeagueConnection = new DbLeague({ initData });
    await dbLeagueConnection.connect();
    return dbLeagueConnection;
  }

  private async connect(): Promise<DbLeague> {
    this.league = await prisma.league.findUniqueOrThrow({
      where: {
        name: this.initData.name,
      },
    });

    return this;
  }

  private set league(league: League) {
    this.wrappedLeague = league;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}