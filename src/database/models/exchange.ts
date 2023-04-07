import * as sqlz from 'sequelize';

import { sequelize } from '../database';

import * as databaseModels from '../models';

export class Exchange extends sqlz.Model<
  sqlz.InferAttributes<Exchange, { omit: 'games' | 'odds'}>,
  sqlz.InferCreationAttributes<Exchange, { omit: 'games' | 'odds'}>
> {
  // id
  declare id: sqlz.CreationOptional<number>;

  // column headers
  declare name: string;
  declare url: string;

  // timestamps
  declare createdAt: sqlz.CreationOptional<Date>;
  declare updatedAt: sqlz.CreationOptional<Date>;

  // foreign keys
  // none, all associated sequelize models are plural

  // associated sequelize model(s)
  declare games?: sqlz.NonAttribute<databaseModels.Game[]>;
  declare odds?: sqlz.NonAttribute<databaseModels.Odd[]>;

  // virtual model associations
  // belongsToMany(Game)
  declare getGames: sqlz.BelongsToManyGetAssociationsMixin<databaseModels.Game>;
  declare addGame: sqlz.BelongsToManyAddAssociationMixin<databaseModels.Game, number>;
  declare addGames: sqlz.BelongsToManyAddAssociationsMixin<databaseModels.Game, number>;
  declare setGames: sqlz.BelongsToManySetAssociationsMixin<databaseModels.Game, number>;
  declare removeGame: sqlz.BelongsToManyRemoveAssociationMixin<databaseModels.Game, number>;
  declare removeGames: sqlz.BelongsToManyRemoveAssociationsMixin<databaseModels.Game, number>;
  declare hasGame: sqlz.BelongsToManyHasAssociationMixin<databaseModels.Game, number>;
  declare hasGames: sqlz.BelongsToManyHasAssociationsMixin<databaseModels.Game, number>;
  declare countGames: sqlz.BelongsToManyCountAssociationsMixin;
  declare createGame: sqlz.BelongsToManyCreateAssociationMixin<databaseModels.Game>;
  
  // hasMany(Odd)
  declare getOdds: sqlz.HasManyGetAssociationsMixin<databaseModels.Odd>;
  declare addOdd: sqlz.HasManyAddAssociationMixin<databaseModels.Odd, number>;
  declare addOdds: sqlz.HasManyAddAssociationsMixin<databaseModels.Odd, number>;
  declare setOdds: sqlz.HasManySetAssociationsMixin<databaseModels.Odd, number>;
  declare removeOdd: sqlz.HasManyRemoveAssociationMixin<databaseModels.Odd, number>;
  declare removeOdds: sqlz.HasManyRemoveAssociationsMixin<databaseModels.Odd, number>;
  declare hasOdd: sqlz.HasManyHasAssociationMixin<databaseModels.Odd, number>;
  declare hasOdds: sqlz.HasManyHasAssociationsMixin<databaseModels.Odd, number>;
  declare countOdds: sqlz.HasManyCountAssociationsMixin;
  declare createOdd: sqlz.HasManyCreateAssociationMixin<databaseModels.Odd, 'exchangeId'>;

  // associated local model
  // none

  // Not sure what the below does, but was included in the example and don't 
  // want to forget.
  // declare static associations: {
  //     games: Association<Exchange, Game>;
  //     odds: Association<Exchange, Odd>;
  // };
}

Exchange.init({
  id: {
      type: sqlz.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
  },
  name: new sqlz.DataTypes.STRING(128),
  url: new sqlz.DataTypes.STRING(128),
  createdAt: sqlz.DataTypes.DATE,
  updatedAt: sqlz.DataTypes.DATE,
}, {
  sequelize,
  tableName: 'exchanges',
});