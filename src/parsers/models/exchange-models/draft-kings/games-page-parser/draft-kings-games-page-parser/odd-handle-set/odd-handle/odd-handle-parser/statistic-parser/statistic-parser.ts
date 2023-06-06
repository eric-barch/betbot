
import { DbUtilityFunctions, prisma } from '@/db';
import { Statistic } from '@prisma/client';
import { OddHandleParser } from '../odd-handle-parser';

export class StatisticLinker {
  private parentOddHandleParser: OddHandleParser;
  private wrappedStatistic: Statistic | undefined;

  private constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    this.parentOddHandleParser = parentOddHandleParser;
  }

  public static async create({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }): Promise<StatisticLinker> {
    const statisticLinker = new StatisticLinker({ parentOddHandleParser });
    await statisticLinker.link();
    return statisticLinker;
  }

  private async link(): Promise<Statistic> {
    const game = this.parentOddHandleParser.game;
    const statisticName = await this.parseStatisticName();

    this.statistic = await DbUtilityFunctions.findOrCreateStatisticByGameAndStatisticName({
      game,
      statisticName,
    });

    return this.statistic;
  }

  private async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentOddHandleParser.game;

    const awayTeam = await prisma.team.findFirstOrThrow({ where: { id: game.awayTeamId } });
    const homeTeam = await prisma.team.findFirstOrThrow({ where: { id: game.homeTeamId } });

    const spreadPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^\\w\\d]*([+-]?\\d+\\.\\d)+?.*`, "i");
    const totalPattern = new RegExp("^.*\\b(O|U|Over|Under)\\b[^\\w\\d]*(\\d+(\\.\\d+)?).*$", "i");
    const winnerPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^0-9]*$`, "i");

    const spreadPatternMatches = spreadPattern.exec(ariaLabel);
    const totalPatternMatches = totalPattern.exec(ariaLabel);
    const winnerPatternMatches = winnerPattern.exec(ariaLabel);

    if (spreadPatternMatches) {
      return (spreadPatternMatches[1] === awayTeam.identifierFull) ? 'spread_away' : 'spread_home';
    } else if (totalPatternMatches) {
      return (totalPatternMatches[1].toUpperCase().startsWith('O')) ? 'total_over' : 'total_under';
    } else if (winnerPatternMatches) {
      return (winnerPatternMatches[1] === awayTeam.identifierFull) ? 'winner_away' : 'winner_home';
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async getAriaLabel(): Promise<string> {
    const buttonElement = this.parentOddHandleParser.buttonElement;
    const ariaLabel = await (await buttonElement.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`)
    }

    return ariaLabel;
  }

  private set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic {
    if (!this.wrappedStatistic) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}