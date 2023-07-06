import {
  DbStatisticConnection, SpecializedDbStatisticConnection,
} from '@/parsers/models/common-models';

export class FanDuelDbStatisticConnection implements SpecializedDbStatisticConnection {
  private readonly parentDbStatisticConnection: DbStatisticConnection;

  public constructor({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection;
  }) {
    this.parentDbStatisticConnection = parentDbStatisticConnection;
  }

  public async parseStatisticName(): Promise<string> {
    return await this.parseStatisticNameByAriaLabel();
  }

  private async parseStatisticNameByAriaLabel(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentDbStatisticConnection.game;

    const awayTeam = game.awayTeam;
    const homeTeam = game.homeTeam;

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
      if (ariaLabel.toLowerCase().includes(awayTeam.identifierFull.toLowerCase())) {
        return 'total_over';
      }

      if (ariaLabel.toLowerCase().includes(homeTeam.identifierFull.toLowerCase())) {
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
    const button = this.parentDbStatisticConnection.button;
    const ariaLabel = await button.evaluate(el => el.ariaLabel!);
    return ariaLabel;
  }
}