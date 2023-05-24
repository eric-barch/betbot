import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { Exchange } from './exchange';
import { League } from './league';
import { PageType } from './page-type';

export class ExchangeLeague extends s.Model<
  s.InferAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>,
  s.InferCreationAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>
> {
  declare id: s.CreationOptional<number>;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;
  declare exchangeId: s.ForeignKey<Exchange['id']>;
  declare leagueId: s.ForeignKey<League['id']>;
  declare exchange: s.NonAttribute<Exchange>;
  declare league: s.NonAttribute<League>;

  // belongsTo(Exchange)
  declare createExchange: s.BelongsToCreateAssociationMixin<Exchange>;
  declare getExchange: s.BelongsToGetAssociationMixin<Exchange>;
  declare setExchange: s.BelongsToSetAssociationMixin<Exchange, number>;

  // belongsTo(League)
  declare createLeague: s.BelongsToCreateAssociationMixin<League>;
  declare getLeague: s.BelongsToGetAssociationMixin<League>;
  declare setLeague: s.BelongsToSetAssociationMixin<League, number>;

  // belongsToMany(PageType)
  declare getPageTypes: s.BelongsToManyGetAssociationsMixin<PageType>;
  declare addPageType: s.BelongsToManyAddAssociationMixin<PageType, number>;
  declare addPageTypes: s.BelongsToManyAddAssociationsMixin<PageType, number>;
  declare setPageTypes: s.BelongsToManySetAssociationsMixin<PageType, number>;
  declare removePageType: s.BelongsToManyRemoveAssociationMixin<PageType, number>;
  declare removePageTypes: s.BelongsToManyRemoveAssociationsMixin<PageType, number>;
  declare hasPageType: s.BelongsToManyHasAssociationMixin<PageType, number>;
  declare hasPageTypes: s.BelongsToManyHasAssociationsMixin<PageType, number>;
  declare countPageTypes: s.BelongsToManyCountAssociationsMixin;
  declare createPageType: s.BelongsToManyCreateAssociationMixin<PageType>;
}

ExchangeLeague.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: 'ExchangeLeagues',
  }
);
