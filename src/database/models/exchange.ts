import {
  BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from 'sequelize';

import { sequelize } from '../database';

import { Game } from './game';
import { Odd } from './odd';
import { Team } from './team';

export class Exchange extends Model<
  InferAttributes<Exchange, { omit: 'games' | 'odds'}>,
  InferCreationAttributes<Exchange, { omit: 'games' | 'odds'}>
> {
  // id
  declare id: CreationOptional<number>;

  // column headers
  declare name: string;
  declare url: string;

  // timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // foreign keys
  // none, all associated sequelize models are plural

  // associated sequelize model(s)
  declare games?: NonAttribute<Game[]>;
  declare odds?: NonAttribute<Odd[]>;

  // virtual model associations
  // belongsToMany(Game)
  declare getGames: BelongsToManyGetAssociationsMixin<Game>;
  declare addGame: BelongsToManyAddAssociationMixin<Game, number>;
  declare addGames: BelongsToManyAddAssociationsMixin<Game, number>;
  declare setGames: BelongsToManySetAssociationsMixin<Game, number>;
  declare removeGame: BelongsToManyRemoveAssociationMixin<Game, number>;
  declare removeGames: BelongsToManyRemoveAssociationsMixin<Game, number>;
  declare hasGame: BelongsToManyHasAssociationMixin<Game, number>;
  declare hasGames: BelongsToManyHasAssociationsMixin<Game, number>;
  declare countGames: BelongsToManyCountAssociationsMixin;
  declare createGame: BelongsToManyCreateAssociationMixin<Game>;
  
  // hasMany(Odd)
  declare getOdds: HasManyGetAssociationsMixin<Odd>;
  declare addOdd: HasManyAddAssociationMixin<Odd, number>;
  declare addOdds: HasManyAddAssociationsMixin<Odd, number>;
  declare setOdds: HasManySetAssociationsMixin<Odd, number>;
  declare removeOdd: HasManyRemoveAssociationMixin<Odd, number>;
  declare removeOdds: HasManyRemoveAssociationsMixin<Odd, number>;
  declare hasOdd: HasManyHasAssociationMixin<Odd, number>;
  declare hasOdds: HasManyHasAssociationsMixin<Odd, number>;
  declare countOdds: HasManyCountAssociationsMixin;
  declare createOdd: HasManyCreateAssociationMixin<Odd, 'exchangeId'>;

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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
  },
  name: new DataTypes.STRING(128),
  url: new DataTypes.STRING(128),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'exchanges',
});