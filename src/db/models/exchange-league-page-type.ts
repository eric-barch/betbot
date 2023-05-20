import * as s from 'sequelize';

import { sequelizeInstance } from '../sequelize-instance';
import { ExchangeLeague } from './exchange-league';
import { PageType } from './page-type';

import * as parsers from '../../parsers';

export class ExchangeLeaguePageType extends s.Model<
    s.InferAttributes<ExchangeLeaguePageType, { omit: 'exchangeLeague' | 'pageType' }>,
    s.InferCreationAttributes<ExchangeLeaguePageType, { omit: 'exchangeLeague' | 'pageType' }>
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

    // belongsTo(PageType)
    declare createPageType: s.BelongsToCreateAssociationMixin<PageType>;
    declare getPageType: s.BelongsToGetAssociationMixin<PageType>;
    declare setPageType: s.BelongsToSetAssociationMixin<PageType, number>;

    public async getParser(): Promise<parsers.Parser> {
        const exchangeLeague = await this.getExchangeLeague();

        const exchangeId = (await exchangeLeague.getExchange()).id;
        const leagueId = (await exchangeLeague.getLeague()).id;
        const pageTypeId = this.pageTypeId;

        const parser = parsers.getParser({
            exchangeId,
            leagueId,
            pageTypeId,
        });

        return parser;
    }
}

ExchangeLeaguePageType.init({
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
    sequelize: sequelizeInstance,
    tableName: 'ExchangeLeaguePages',
})