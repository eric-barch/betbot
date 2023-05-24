import { DraftKingsGamesPageParser } from './shared-models';

export class DraftKingsMlbGamesPageParser extends DraftKingsGamesPageParser {
  constructor() {
    super({ url: 'https://sportsbook.draftkings.com/leagues/baseball/mlb' });
  }
}
