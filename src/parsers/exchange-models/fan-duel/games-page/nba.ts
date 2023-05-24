import { FanDuelGamesPageParser } from './shared-models';

export class FanDuelNbaGamesPageParser extends FanDuelGamesPageParser {
  constructor() {
    super({ url: 'https://sportsbook.fanduel.com/navigation/nba' });
  }
}