import { Parser } from './parser';
import { DraftKingsNbaGamesPageParser } from './draft-kings';
import { FanDuelNbaGamesPageParser } from './fan-duel';
import { SugarHouseNbaGamesPageParser } from './sugar-house';

import * as global from '../global';

export async function getParser({
    exchangeId,
    leagueId,
    pageTypeId,
}: {
    exchangeId: number,
    leagueId: number,
    pageTypeId: number,
}): Promise<Parser> {
    switch ({
        exchangeId,
        leagueId,
        pageTypeId,
    }) {
        case {
            exchangeId: global.exchanges.draftKings.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        }:
            return new DraftKingsNbaGamesPageParser();
        case {
            exchangeId: global.exchanges.fanDuel.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        }:
            return new FanDuelNbaGamesPageParser();
        case {
            exchangeId: global.exchanges.sugarHouse.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        }:
            return new SugarHouseNbaGamesPageParser();
        default:
            throw new Error(`Did not find matching parser.`);
    }
}