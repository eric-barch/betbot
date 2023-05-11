import * as s from 'sequelize';

import { sequelize } from './instance';
import { ExchangeLeague } from './exchangeLeague';
import { PageType } from './pageType';
import * as global from '../global';
import * as pageParsers from '../pageParsers';

class ExchangeLeaguePageKey {
    public exchangeId: number;
    public leagueId: number;
    public pageTypeId: number;

    constructor({
        exchangeId,
        leagueId,
        pageTypeId,
    }: {
        exchangeId: number,
        leagueId: number,
        pageTypeId: number,
    }) {
        this.exchangeId = exchangeId;
        this.leagueId = leagueId;
        this.pageTypeId = pageTypeId;
    }

    public matches({
        exchangeId,
        leagueId,
        pageTypeId,
    }: {
        exchangeId: number,
        leagueId: number,
        pageTypeId: number,
    }): boolean {
        const exchangeIdMatches = (this.exchangeId === exchangeId);
        const leagueIdMatches = (this.leagueId === leagueId);
        const pageTypeIdMatches = (this.pageTypeId === pageTypeId);

        if (exchangeIdMatches && leagueIdMatches && pageTypeIdMatches) {
            return true;
        }

        return false;
    }
}

export class ExchangeLeaguePage extends s.Model<
    s.InferAttributes<ExchangeLeaguePage, { omit: 'exchangeLeague' /*| 'getParser' */}>,
    s.InferCreationAttributes<ExchangeLeaguePage, { omit: 'exchangeLeague' /*| 'getParser' */}>
> {
    declare id: s.CreationOptional<number>;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchangeLeagueId: s.ForeignKey<ExchangeLeague['id']>;
    declare pageTypeId: s.ForeignKey<PageType['id']>;
    declare exchangeLeague: s.NonAttribute<ExchangeLeague>;
    declare pageType: s.NonAttribute<PageType>;

    // belongsTo(ExchangeLeague)
    declare createExchangeLeague: s.BelongsToCreateAssociationMixin<ExchangeLeague>;
    declare getExchangeLeague: s.BelongsToGetAssociationMixin<ExchangeLeague>;
    declare setExchangeLeague: s.BelongsToSetAssociationMixin<ExchangeLeague, number>;

    public async getGamesPageParser(): Promise<pageParsers.GamesPageParser> {
        const exchangeLeague = await this.getExchangeLeague();

        const exchangeId = (await exchangeLeague.getExchange()).id;
        const leagueId = (await exchangeLeague.getLeague()).id;
        const pageTypeId = this.pageTypeId;

        const exchangeLeaguePageKey = new ExchangeLeaguePageKey({
            exchangeId,
            leagueId,
            pageTypeId,
        });

        if (exchangeLeaguePageKey.matches({
            exchangeId: global.exchanges.draftKings.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        })) {
            const parser = new pageParsers.DraftKingsNbaGamesPageParser();
            await parser.connect();
            return parser;
        } else if (exchangeLeaguePageKey.matches({
            exchangeId: global.exchanges.fanDuel.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        })) {
            const parser = new pageParsers.FanDuelNbaGamesPageParser();
            await parser.connect();
            return parser;
        } else if (exchangeLeaguePageKey.matches({
            exchangeId: global.exchanges.sugarHouse.id,
            leagueId: global.leagues.nba.id,
            pageTypeId: global.pageTypes.gamesPage.id,
        })) {
            const parser = new pageParsers.SugarHouseNbaGamesPageParser();
            await parser.connect();
            return parser;
        } else {
            throw new Error(`Did not find matching parser.`);
        }
    }
}

ExchangeLeaguePage.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
    exchangeLeagueId: s.DataTypes.INTEGER.UNSIGNED,
    pageTypeId: s.DataTypes.INTEGER.UNSIGNED,
}, {
    sequelize,
    tableName: 'ExchangeLeaguePages',
})