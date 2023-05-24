import { FanDuelGamesPageParser } from './shared-models';

export class FanDuelMlbGamesPageParser extends FanDuelGamesPageParser {
  constructor() {
    super({ url: 'https://sportsbook.fanduel.com/navigation/mlb' });
  }
}
