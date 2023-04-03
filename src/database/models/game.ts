import {
    BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin,
    BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes, ForeignKey,
    HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes, InferCreationAttributes,
    Model,
    NonAttribute
  } from 'sequelize';
  
  import { sequelize } from '../database';
  
  import { Exchange } from './exchange';
  import { Odd } from './odd';
  import { Team } from './team';
  
  export class Game extends Model<
    InferAttributes<Game, {omit: 'exchanges' | 'odds' | 'awayTeam' | 'homeTeam'}>,
    InferCreationAttributes<Game, {omit: 'exchanges' | 'odds' | 'awayTeam' | 'homeTeam'}>
  > {
    // id
    declare id: CreationOptional<number>;
  
    // column headers
    declare startDate: Date;
  
    // timestamps
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    
    // foreign keys
    declare awayTeamId: ForeignKey<Team['id']>;
    declare homeTeamId: ForeignKey<Team['id']>;
  
    // associated sequelize models
    declare exchanges?: NonAttribute<Exchange[]>;
    declare odds?: NonAttribute<Odd[]>;
    declare awayTeam?: NonAttribute<Team>;
    declare homeTeam?: NonAttribute<Team>;
  
    // virtual model associations
    // belongsToMany(Exchange)
    declare getExchanges: BelongsToManyGetAssociationsMixin<Exchange>;
    declare addExchange: BelongsToManyAddAssociationMixin<Exchange, number>;
    declare addExchanges: BelongsToManyAddAssociationsMixin<Exchange, number>;
    declare setExchanges: BelongsToManySetAssociationsMixin<Exchange, number>;
    declare removeExchange: BelongsToManyRemoveAssociationMixin<Exchange, number>;
    declare removeExchanges: BelongsToManyRemoveAssociationsMixin<Exchange, number>;
    declare hasExchange: BelongsToManyHasAssociationMixin<Exchange, number>;
    declare hasExchanges: BelongsToManyHasAssociationsMixin<Exchange, number>;
    declare countExchanges: BelongsToManyCountAssociationsMixin;
    declare createExchange: BelongsToManyCreateAssociationMixin<Exchange>;
  
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
    declare createOdd: HasManyCreateAssociationMixin<Odd, 'gameId'>;
  
    // belongsTo(Team)
    declare createTeam: BelongsToCreateAssociationMixin<Team>;
    declare getTeam: BelongsToGetAssociationMixin<Team>;
    declare setTeam: BelongsToSetAssociationMixin<Team, number>;
  
    // associated local model
    // none
  }
  
  Game.init({
      id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
      },
      startDate: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
  }, {
      sequelize,
      tableName: 'games'
  });