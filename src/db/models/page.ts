import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { ExchangeLeague } from './exchange-league';
import { PageType } from './page-type';
import { Game } from './game';
import { PageParser } from '../../parsers/shared-models';
import { PageParserFactory } from '../../parsers/shared-models/page-parser-factory';

export class Page extends s.Model<
  s.InferAttributes<Page, { omit: 'exchangeLeague' | 'pageType' }>,
  s.InferCreationAttributes<Page, { omit: 'exchangeLeague' | 'pageType' }>
> {
  declare id: s.CreationOptional<number>;
  declare exchangeLeagueId: s.ForeignKey<ExchangeLeague['id']>;
  declare pageTypeId: s.ForeignKey<PageType['id']>;
  declare exchangeLeague: s.NonAttribute<ExchangeLeague>;
  declare pageType: s.NonAttribute<PageType>;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;

  // belongsTo(ExchangeLeague)
  declare createExchangeLeague: s.BelongsToCreateAssociationMixin<ExchangeLeague>;
  declare getExchangeLeague: s.BelongsToGetAssociationMixin<ExchangeLeague>;
  declare setExchangeLeague: s.BelongsToSetAssociationMixin<ExchangeLeague, number>;

  // belongsTo(PageType)
  declare createPageType: s.BelongsToCreateAssociationMixin<PageType>;
  declare getPageType: s.BelongsToGetAssociationMixin<PageType>;
  declare setPageType: s.BelongsToSetAssociationMixin<PageType, number>;

  // belongsToMany(Game)
  declare getGames: s.BelongsToManyGetAssociationsMixin<Game>;
  declare addGame: s.BelongsToManyAddAssociationMixin<Game, number>;
  declare addGames: s.BelongsToManyAddAssociationsMixin<Game, number>;
  declare setGames: s.BelongsToManySetAssociationsMixin<Game, number>;
  declare removeGame: s.BelongsToManyRemoveAssociationMixin<Game, number>;
  declare removeGames: s.BelongsToManyRemoveAssociationsMixin<Game, number>;
  declare hasGame: s.BelongsToManyHasAssociationMixin<Game, number>;
  declare hasGames: s.BelongsToManyHasAssociationsMixin<Game, number>;
  declare countGames: s.BelongsToManyCountAssociationsMixin;
  declare createGame: s.BelongsToManyCreateAssociationMixin<Game>;

  public async getPageParser(): Promise<PageParser> {
    const exchangeLeague = await this.getExchangeLeague();

    const exchangeId = exchangeLeague.exchangeId;
    const leagueId = exchangeLeague.leagueId;
    const pageTypeId = this.pageTypeId;

    const parser = await PageParserFactory.getParser({
      exchangeId,
      leagueId,
      pageTypeId,
      sequelizePage: this,
    });

    await parser.connect();

    return parser;
  }
}

Page.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    exchangeLeagueId: s.DataTypes.INTEGER.UNSIGNED,
    pageTypeId: s.DataTypes.INTEGER.UNSIGNED,
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: 'Pages',
  }
);
