import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { ExchangeLeague } from './exchange-league';
import { PageType } from './page-type';
import { Parser } from '../../parsers/base-models';
import { ParserFactory } from '../../parsers/base-models/parser-factory';

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

  public async getParser(): Promise<Parser> {
    const exchangeLeague = await this.getExchangeLeague();

    const exchangeId = exchangeLeague.exchangeId;
    const leagueId = exchangeLeague.leagueId;
    const pageTypeId = this.pageTypeId;

    const parser = await ParserFactory.getParser({
      exchangeId,
      leagueId,
      pageTypeId,
    });

    await parser.connect();

    return parser;
  }
}

ExchangeLeaguePageType.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
    exchangeLeagueId: s.DataTypes.INTEGER.UNSIGNED,
    pageTypeId: s.DataTypes.INTEGER.UNSIGNED,
  },
  {
    sequelize: sequelize,
    tableName: 'ExchangeLeaguePageTypes',
  }
);
