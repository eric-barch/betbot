import { SugarHouseGamesPageParser } from './shared-models/games-page-parser';

export class SugarHouseNbaGamesPageParser extends SugarHouseGamesPageParser {
  constructor() {
    super({ url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches' });
  }
}