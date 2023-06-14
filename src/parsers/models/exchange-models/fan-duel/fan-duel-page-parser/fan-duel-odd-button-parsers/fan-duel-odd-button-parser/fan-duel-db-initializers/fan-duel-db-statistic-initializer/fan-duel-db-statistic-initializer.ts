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
      if (spreadPatternMatches[1] === awayTeam.identifierFull) {
        return 'spread_away';
      }

      if (spreadPatternMatches[1] === homeTeam.identifierFull) {
        return 'spread_home';
      }

      throw new Error(`Did not find matching spread statistic name.`);
    }

    if (winnerPatternMatches) {
      if (winnerPatternMatches[1] === awayTeam.identifierFull) {
        return 'winner_away';
      }

      if (winnerPatternMatches[1] === homeTeam.identifierFull) {
        return 'winner_home';
      }

      throw new Error(`Did not find matching winner statistic name.`);
    }

    if (totalPatternMatches) {
      if (totalPatternMatches[1] === awayTeam.identifierFull) {
        return 'total_over';
      }

      if (totalPatternMatches[1] === homeTeam.identifierFull) {
        return 'total_under';
      }

      throw new Error(`Did not find matching total statistic name.`);
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