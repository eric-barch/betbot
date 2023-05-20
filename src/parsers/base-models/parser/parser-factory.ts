import { Parser } from './parser';

import * as exchangeModels from '../../exchange-models';
import * as global from '../../../global';

export class ParserFactory {
    public static async getParser({
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
                exchangeId: global.draftKings.id,
                leagueId: global.leagues.nba.id,
                pageTypeId: global.pageTypes.gamesPage.id,
            }:
                return new exchangeModels.DraftKingsNbaGamesPageParser();
            case {
                exchangeId: global.fanDuel.id,
                leagueId: global.leagues.nba.id,
                pageTypeId: global.pageTypes.gamesPage.id,
            }:
                return new exchangeModels.FanDuelNbaGamesPageParser();
            case {
                exchangeId: global.sugarHouse.id,
                leagueId: global.leagues.nba.id,
                pageTypeId: global.pageTypes.gamesPage.id,
            }:
                return new exchangeModels.SugarHouseNbaGamesPageParser();
            default:
                throw new Error(`Did not find matching parser.`);
        }
    }
}