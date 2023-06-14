import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/shared-models';
import { DbStatisticInitializer } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/db-initializers/db-statistic-initializer';

export class FanDuelDbStatisticInitializer extends DbStatisticInitializer {
  public static async create({
    parentOddButtonParser
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<FanDuelDbStatisticInitializer> {
    const fanDuelDbStatisticInitializer = new FanDuelDbStatisticInitializer({ parentOddButtonParser });
    await fanDuelDbStatisticInitializer.init();
    return fanDuelDbStatisticInitializer;
  }

  protected async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentOddButtonParser.game;

    const awayTeam = await prisma.team.findFirstOrThrow({ where: { id: game.awayTeamId } });
    const homeTeam = await prisma.team.findFirstOrThrow({ where: { id: game.homeTeamId } });

    const spreadPattern = new RegExp(`\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b.*\\b(run line|spread)\\b`, "i");
    const winnerPattern = new RegExp(`\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b.*\\bmoneyline\\b`, "i");
    const totalPattern = new RegExp(`\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b.*\\btotal\\b`, "i");

    const spreadPatternMatches = spreadPattern.exec(ariaLabel);
    const winnerPatternMatches = winnerPattern.exec(ariaLabel);
    const totalPatternMatches = totalPattern.exec(ariaLabel);

    if (spreadPatternMatches) {
      return (spreadPatternMatches[1] === awayTeam.identifierFull) ? 'spread_away' : 'spread_home';
    } else if (winnerPatternMatches) {
      return (winnerPatternMatches[1] === awayTeam.identifierFull) ? 'winner_away' : 'winner_home';
    } else if (totalPatternMatches) {
      return (totalPatternMatches[1].toUpperCase().startsWith('O')) ? 'total_over' : 'total_under';
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async getAriaLabel(): Promise<string> {
    const button = this.parentOddButtonParser.button;

    if (!button) {
      throw new Error(`button is null.`);
    }

    const ariaLabel = await (await button.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`)
    }

    return ariaLabel;
  }
}