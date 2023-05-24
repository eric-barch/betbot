import { DraftKingsGamesPageParser } from './shared-models';

export class DraftKingsNbaGamesPageParser extends DraftKingsGamesPageParser {
  constructor() {
    super({ url: 'https://sportsbook.draftkings.com/leagues/basketball/nba' });
  }
}