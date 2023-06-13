import { League } from '@prisma/client';

import { prisma } from '@/db';
import { LeagueInitData } from '@/setup';

export class DbLeagueInitializer {
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
  }): Promise<DbLeagueInitializer> {
    const dbLeagueInitializer = new DbLeagueInitializer({ initData });
    await dbLeagueInitializer.init();
    return dbLeagueInitializer;
  }

  private async init(): Promise<DbLeagueInitializer> {
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