import { mlb } from '@/config';
import { DraftKingsGamesPageParser } from './draft-kings-games-page-parser';

export class DraftKingsMlbGamesPageParser extends DraftKingsGamesPageParser {
  public constructor() {
    super({ leagueInitData: mlb });
  }
}