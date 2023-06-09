
import { DbUtilityFunctions, prisma } from '@/db';
import { Statistic } from '@prisma/client';
import { OddButtonParser } from '@/parsers';
import { DbStatisticConnection } from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser/db-connections/db-statistic-connection';

export class DraftKingsDbStatisticConnection extends DbStatisticConnection {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsDbStatisticConnection> {
    const draftKingsDbStatisticConnection = new DraftKingsDbStatisticConnection({ parentOddButtonParser });
    await draftKingsDbStatisticConnection.init();
    return draftKingsDbStatisticConnection;
  }

  protected async updateDbStatistic(): Promise<Statistic> {
    const game = this.parentOddButtonParser.game;
    const statisticName = await this.parseStatisticName();

    this.statistic = await DbUtilityFunctions.findOrCreateStatisticByGameAndStatisticName({
      game,
      statisticName,
    });

    return this.statistic;
  }

  private async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentOddButtonParser.game;

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
    const buttonElement = this.parentOddButtonParser.button;

    if (!buttonElement) {
      throw new Error(`buttonElement is null.`);
    }

    const ariaLabel = await (await buttonElement.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`)
    }

    return ariaLabel;
  }
}