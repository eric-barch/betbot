import { Statistic } from '@prisma/client';

import { GameWithTeams, prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export abstract class DbStatisticConnection {
  public readonly parent: OddButtonParser;
  public readonly game: GameWithTeams;
  private wrappedStatistic: Statistic | undefined;

  /**game is required to be passed in as an argument because it will not have been instantiated in
   * the parent yet */
  protected constructor({
    parent,
    game,
  }: {
    parent: OddButtonParser,
    game: GameWithTeams,
  }) {
    this.parent = parent;
    this.game = game;
  }

  protected async init(): Promise<DbStatisticConnection> {
    this.statistic = await this.findOrCreateStatistic();
    return this;
  }

  private async findOrCreateStatistic(): Promise<Statistic> {
    const name = await this.parseStatisticName();
    const gameId = this.game.id;

    this.statistic = await prisma.statistic.upsert({
      where: {
        name_gameId: {
          name,
          gameId,
        },
      },
      update: {},
      create: {
        name,
        gameId,
      },
    });

    return this.statistic;
  }

  protected abstract parseStatisticName(): Promise<string>;

  private set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic {
    if (this.wrappedStatistic === undefined) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}