import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Game } from './game';
import { Odd } from './odd';

export class Exchange extends sqlz.Model<
  sqlz.InferAttributes<Exchange, { omit: 'games' | 'odds'}>,
  sqlz.InferCreationAttributes<Exchange, { omit: 'games' | 'odds'}>
> {
  // id
  declare id: sqlz.CreationOptional<number>;

  // column headers
  declare name: string;

  // timestamps
  declare createdAt: sqlz.CreationOptional<Date>;
  declare updatedAt: sqlz.CreationOptional<Date>;

  // foreign keys
  // none, all associated sequelize models are plural

  // associated sequelize model(s)
  declare games?: sqlz.NonAttribute<Game[]>;
  declare odds?: sqlz.NonAttribute<Odd[]>;

  // virtual model associations
  // belongsToMany(Game)
  declare getGames: sqlz.BelongsToManyGetAssociationsMixin<Game>;
  declare addGame: sqlz.BelongsToManyAddAssociationMixin<Game, number>;
  declare addGames: sqlz.BelongsToManyAddAssociationsMixin<Game, number>;
  declare setGames: sqlz.BelongsToManySetAssociationsMixin<Game, number>;
  declare removeGame: sqlz.BelongsToManyRemoveAssociationMixin<Game, number>;
  declare removeGames: sqlz.BelongsToManyRemoveAssociationsMixin<Game, number>;
  declare hasGame: sqlz.BelongsToManyHasAssociationMixin<Game, number>;
  declare hasGames: sqlz.BelongsToManyHasAssociationsMixin<Game, number>;
  declare countGames: sqlz.BelongsToManyCountAssociationsMixin;
  declare createGame: sqlz.BelongsToManyCreateAssociationMixin<Game>;
  
  // hasMany(Odd)
  declare getOdds: sqlz.HasManyGetAssociationsMixin<Odd>;
  declare addOdd: sqlz.HasManyAddAssociationMixin<Odd, number>;
  declare addOdds: sqlz.HasManyAddAssociationsMixin<Odd, number>;
  declare setOdds: sqlz.HasManySetAssociationsMixin<Odd, number>;
  declare removeOdd: sqlz.HasManyRemoveAssociationMixin<Odd, number>;
  declare removeOdds: sqlz.HasManyRemoveAssociationsMixin<Odd, number>;
  declare hasOdd: sqlz.HasManyHasAssociationMixin<Odd, number>;
  declare hasOdds: sqlz.HasManyHasAssociationsMixin<Odd, number>;
  declare countOdds: sqlz.HasManyCountAssociationsMixin;
  declare createOdd: sqlz.HasManyCreateAssociationMixin<Odd, 'exchangeId'>;

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
  createdAt: sqlz.DataTypes.DATE,
  updatedAt: sqlz.DataTypes.DATE,
}, {
  sequelize,
  tableName: 'exchanges',
});