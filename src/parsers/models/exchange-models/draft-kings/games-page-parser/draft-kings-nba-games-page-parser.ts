import { nba } from '@/config';
import { DraftKingsGamesPageParser } from './draft-kings-games-page-parser';

export class DraftKingsNbaGamesPageParser extends DraftKingsGamesPageParser {
  public constructor() {
    super({ leagueInitData: nba });
  }
}