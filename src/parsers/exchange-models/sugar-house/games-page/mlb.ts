import { SugarHouseGamesPageParser } from './shared-models/games-page-parser';

export class SugarHouseMlbGamesPageParser extends SugarHouseGamesPageParser {
  constructor() {
    super({
      url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home',
    });
  }
}
