import { GameWithTeams } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';
import {
  DbStatisticConnection
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/db-connection/db-statistic-connection';

export class FanDuelDbStatisticConnection extends DbStatisticConnection {
  public static async create({
    parent,
    game,
  }: {
    parent: OddButtonParser,
    game: GameWithTeams,
  }): Promise<FanDuelDbStatisticConnection> {
    const fanDuelDbStatisticConnection = new FanDuelDbStatisticConnection({
      parent,
      game,
    });
    await fanDuelDbStatisticConnection.init();
    return fanDuelDbStatisticConnection;
  }

  public async parseStatisticName(): Promise<string> {
    return await this.parseStatisticNameByAriaLabel();
  }

  private async parseStatisticNameByAriaLabel(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();

    const awayTeam = this.game.awayTeam;
    const homeTeam = this.game.homeTeam;

    const isSpreadOdd = ariaLabel.toLowerCase().includes('run line');
    const isTotalOdd = ariaLabel.toLowerCase().includes('total runs');
    const isMoneylineOdd = ariaLabel.toLowerCase().includes('moneyline');

    if (isSpreadOdd) {
      if (ariaLabel.toLowerCase().includes(awayTeam.identifierFull.toLowerCase())) {
        return 'spread_away';
      }

      if (ariaLabel.toLowerCase().includes(homeTeam.identifierFull.toLowerCase())) {
        return 'spread_home';
      }
    }

    if (isTotalOdd) {
      const awayTeamKeywords = new Array<string>(
        awayTeam.identifierFull.toLowerCase(),
        'over',
      );

      if (awayTeamKeywords.some(keyword => ariaLabel.toLowerCase().includes(keyword))) {
        return 'total_over';
      }

      const homeTeamKeywords = new Array<string>(
        homeTeam.identifierFull.toLowerCase(),
        'under',
      );

      if (homeTeamKeywords.some(keyword => ariaLabel.toLowerCase().includes(keyword))) {
        return 'total_under';
      }
    }

    if (isMoneylineOdd) {
      if (ariaLabel.toLowerCase().includes(awayTeam.identifierFull.toLowerCase())) {
        return 'winner_away';
      }

      if (ariaLabel.toLowerCase().includes(homeTeam.identifierFull.toLowerCase())) {
        return 'winner_home';
      }
    }

    throw new Error(`Failed to parse statistic name from aria label: ${ariaLabel}.`);
  }

  private async getAriaLabel(): Promise<string> {
    const button = this.parent.button;
    const ariaLabel = await button.evaluate(el => el.ariaLabel!);
    return ariaLabel;
  }
}