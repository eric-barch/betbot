import { prisma } from '@/db';
import {
  DbStatisticInitializer, SpecializedDbStatisticInitializer,
} from '@/parsers/models/common-models';

export class DraftKingsDbStatisticInitializer implements SpecializedDbStatisticInitializer {
  private readonly parentDbStatisticInitializer: DbStatisticInitializer;

  public constructor({
    parentDbStatisticInitializer,
  }: {
    parentDbStatisticInitializer: DbStatisticInitializer;
  }) {
    this.parentDbStatisticInitializer = parentDbStatisticInitializer;
  }

  public async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentDbStatisticInitializer.game;

    const awayTeam = await prisma.team.findFirstOrThrow({ where: { id: game.awayTeamId } });
    const homeTeam = await prisma.team.findFirstOrThrow({ where: { id: game.homeTeamId } });

    const spreadPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^\\w\\d]*([+-]?\\d+(\\.\\d+)?).*`, "i");
    const totalPattern = new RegExp("^.*\\b(O|U|Over|Under)\\b[^\\w\\d]*(\\d+(\\.\\d+)?).*$", "i");
    const winnerPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^0-9]*$`, "i");

    const spreadPatternMatches = spreadPattern.exec(ariaLabel);
    const totalPatternMatches = totalPattern.exec(ariaLabel);
    const winnerPatternMatches = winnerPattern.exec(ariaLabel);

    if (spreadPatternMatches) {
      if (spreadPatternMatches[1] === awayTeam.identifierFull) {
        return 'spread_away';
      }

      if (spreadPatternMatches[1] === homeTeam.identifierFull) {
        return 'spread_home';
      }

      throw new Error(`Did not find matching spread statistic name.`);
    }

    if (totalPatternMatches) {
      if (totalPatternMatches[1].toUpperCase().startsWith('O')) {
        return 'total_over';
      }

      if (totalPatternMatches[1].toUpperCase().startsWith('U')) {
        return 'total_under';
      }

      throw new Error(`Did not find matching total statistic name.`);
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

    throw new Error(`Did not find matching statistic name.`);
  }

  private async getAriaLabel(): Promise<string> {
    const button = this.parentDbStatisticInitializer.button;

    if (!button) {
      throw new Error(`button is null.`);
    }

    const ariaLabel = await button.evaluate(el => el.ariaLabel);

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`)
    }

    return ariaLabel;
  }
}