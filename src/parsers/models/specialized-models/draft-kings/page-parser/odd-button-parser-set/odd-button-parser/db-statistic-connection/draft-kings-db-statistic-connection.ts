import { TeamService } from '@/db';
import {
  DbStatisticConnection, SpecializedDbStatisticConnection,
} from '@/parsers/models/common-models';

export class DraftKingsDbStatisticConnection implements SpecializedDbStatisticConnection {
  private readonly parentDbStatisticConnection: DbStatisticConnection;

  public constructor({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection;
  }) {
    this.parentDbStatisticConnection = parentDbStatisticConnection;
  }

  public async parseStatisticName(): Promise<string> {
    let statisticName: string;

    try {
      statisticName = await this.parseStatisticNameByButtonPosition();
      return statisticName;
    } catch { }

    try {
      statisticName = await this.parseStatisticNameByAriaLabel();
      return statisticName;
    } catch { }

    throw new Error(`Failed to find or create db statistic.`);
  }

  private async parseStatisticNameByButtonPosition(): Promise<string> {
    const trElement = await this.parentDbStatisticConnection.button.evaluateHandle(el => el.closest('tr')!);
    const tdElement = await this.parentDbStatisticConnection.button.evaluateHandle(el => el.closest('td')!);

    const league = this.parentDbStatisticConnection.parentOddButtonParser.parentPageParser.league;

    const unformattedNameElement = (await trElement.$('div.event-cell__name-text'))!;
    const unformattedName = await unformattedNameElement.evaluate(el => el.textContent!);

    const team = await TeamService.findByUnformattedNameAndLeague({
      unformattedName,
      league,
    });

    const awayTeam = this.parentDbStatisticConnection.game.awayTeam;
    const homeTeam = this.parentDbStatisticConnection.game.homeTeam;

    const childIndex = await trElement.evaluate((parent, child) => {
      const children = Array.from(parent.children);
      return children.indexOf(child);
    }, tdElement);

    if (team.id === awayTeam.id) {
      switch (childIndex) {
        case 1:
          return 'spread_away';
        case 2:
          return 'total_over';
        case 3:
          return 'winner_away';
      }
    }

    if (team.id === homeTeam.id) {
      switch (childIndex) {
        case 1:
          return 'spread_home';
        case 2:
          return 'total_under';
        case 3:
          return 'winner_home';
      }
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async parseStatisticNameByAriaLabel(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();
    const game = this.parentDbStatisticConnection.game;

    const awayTeam = game.awayTeam;
    const homeTeam = game.homeTeam;

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
    }

    if (totalPatternMatches) {
      if (totalPatternMatches[1].toUpperCase().startsWith('O')) {
        return 'total_over';
      }

      if (totalPatternMatches[1].toUpperCase().startsWith('U')) {
        return 'total_under';
      }
    }

    if (winnerPatternMatches) {
      if (winnerPatternMatches[1] === awayTeam.identifierFull) {
        return 'winner_away';
      }

      if (winnerPatternMatches[1] === homeTeam.identifierFull) {
        return 'winner_home';
      }
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async getAriaLabel(): Promise<string> {
    const button = this.parentDbStatisticConnection.button;
    const ariaLabel = await button.evaluate(el => el.ariaLabel!);
    return ariaLabel;
  }
}