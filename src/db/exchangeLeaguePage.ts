import * as s from 'sequelize';

import { sequelize } from './instance';
import { ExchangeLeague } from './exchangeLeague';
import { PageType } from './pageType';

class ExchangeLeaguePageKey {
    exchangeId: number;
    leagueId: number;
    pageName: string;

    constructor({
        exchangeId,
        leagueId,
        pageName,
    }: {
        exchangeId: number,
        leagueId: number,
        pageName: string,
    }) {
        this.exchangeId = exchangeId;
        this.leagueId = leagueId;
        this.pageName = pageName;
    }

    public matches({
        exchangeId,
        leagueId,
        pageName,
    }: {
        exchangeId: number,
        leagueId: number,
        pageName: string,
    }): boolean {
        const exchangeIdMatches = (this.exchangeId === exchangeId);
        const leagueIdMatches = (this.leagueId === leagueId);
        const pageNameMatches = (this.pageName === pageName);

        if (exchangeIdMatches && leagueIdMatches && pageNameMatches) {
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
    declare exchangeLeague?: s.NonAttribute<ExchangeLeague>;
    declare pageType?: s.NonAttribute<PageType>;

    // belongsTo(ExchangeLeague)
    declare createExchangeLeague: s.BelongsToCreateAssociationMixin<ExchangeLeague>;
    declare getExchangeLeague: s.BelongsToGetAssociationMixin<ExchangeLeague>;
    declare setExchangeLeague: s.BelongsToSetAssociationMixin<ExchangeLeague, number>;

    // public async getParser(): Promise<pageParsers.PageParser> {
    //     const exchangeLeague = await this.getExchangeLeague();
    //     const exchangeId = (await exchangeLeague.getExchange()).id;
    //     const leagueId = (await exchangeLeague.getLeague()).id;

    //     const exchangeLeaguePageKey = new ExchangeLeaguePageKey({
    //         exchangeId,
    //         leagueId,
    //         pageName: this.pageName,
    //     });

    //     const draftKingsId = global.exchanges.draftKings.id;
    //     const nbaId = global.leagues.nba.id;

    //     if (exchangeLeaguePageKey)

    //     switch(exchangeLeaguePageKey) {
    //         case {
    //             exchangeId: global.exchanges.draftKings.id,
    //             leagueId: global.leagues.nba.id,
    //             pageName: 'games'
    //         }:
    //             return new pageParsers.DraftKingsGamesPageParser();
    //         case {
    //             exchangeId: global.exchanges.fanDuel.id,
    //             leagueId: global.leagues.nba.id,
    //             pageName: 'games'
    //         }: 
    //             return new pageParsers.FanDuelGamesPageParser();
    //         case {
    //             exchangeId: global.exchanges.sugarHouse.id,
    //             leagueId: global.leagues.nba.id,
    //             pageName: 'games'
    //         }:
    //             return new pageParsers.SugarHouseGamesPageParser();
    //         default:
    //             throw new Error(`Did not find matching parser.`);
    //     }
    // }
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