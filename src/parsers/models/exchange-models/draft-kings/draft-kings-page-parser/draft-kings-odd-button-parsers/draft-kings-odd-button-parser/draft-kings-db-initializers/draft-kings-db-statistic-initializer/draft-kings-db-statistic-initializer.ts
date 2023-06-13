
import { Statistic } from '@prisma/client';

import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/shared-models';
import { DbStatisticInitializer } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/db-initializers/db-statistic-initializer';

export class DraftKingsDbStatisticInitializer extends DbStatisticInitializer {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsDbStatisticInitializer> {
    const draftKingsDbStatisticInitializer = new DraftKingsDbStatisticInitializer({ parentOddButtonParser });
    await draftKingsDbStatisticInitializer.init();
    return draftKingsDbStatisticInitializer;
  }

  protected async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentOddButtonParser.game;

    const awayTeam = await prisma.team.findFirstOrThrow({ where: { id: game.awayTeamId } });
    const homeTeam = await prisma.team.findFirstOrThrow({ where: { id: game.homeTeamId } });

    const spreadPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^\\w\\d]*([+-]?\\d+(\\.\\d+)?).*`, "i");
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