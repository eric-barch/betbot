import * as sqlz from 'sequelize';
  
import { sequelize } from '../../database';
  
  import { Exchange } from './exchange';
  import { Statistic } from './statistic';
  import { Team } from './team';
  
  export class Game extends sqlz.Model<
    sqlz.InferAttributes<Game, {omit: 'exchanges' | 'statistics' | 'awayTeam' | 'homeTeam'}>,
    sqlz.InferCreationAttributes<Game, {omit: 'exchanges' | 'statistics' | 'awayTeam' | 'homeTeam'}>
  > {
    // id
    declare id: sqlz.CreationOptional<number>;
  
    // column headers
    declare startDate: Date;
  
    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;
    
    // foreign keys
    declare awayTeamId: sqlz.ForeignKey<Team['id']>;
    declare homeTeamId: sqlz.ForeignKey<Team['id']>;
  
    // associated sequelize models
    declare exchanges?: sqlz.NonAttribute<Exchange[]>;
    declare statistics?: sqlz.NonAttribute<Statistic[]>;
    declare awayTeam?: sqlz.NonAttribute<Team>;
    declare homeTeam?: sqlz.NonAttribute<Team>;
  
    // virtual model associations
    // belongsToMany(Exchange)
    declare getExchanges: sqlz.BelongsToManyGetAssociationsMixin<Exchange>;
    declare addExchange: sqlz.BelongsToManyAddAssociationMixin<Exchange, number>;
    declare addExchanges: sqlz.BelongsToManyAddAssociationsMixin<Exchange, number>;
    declare setExchanges: sqlz.BelongsToManySetAssociationsMixin<Exchange, number>;
    declare removeExchange: sqlz.BelongsToManyRemoveAssociationMixin<Exchange, number>;
    declare removeExchanges: sqlz.BelongsToManyRemoveAssociationsMixin<Exchange, number>;
    declare hasExchange: sqlz.BelongsToManyHasAssociationMixin<Exchange, number>;
    declare hasExchanges: sqlz.BelongsToManyHasAssociationsMixin<Exchange, number>;
    declare countExchanges: sqlz.BelongsToManyCountAssociationsMixin;
    declare createExchange: sqlz.BelongsToManyCreateAssociationMixin<Exchange>;
  
    // hasMany(Statistic)
    declare getStatistics: sqlz.HasManyGetAssociationsMixin<Statistic>;
    declare addStatistic: sqlz.HasManyAddAssociationMixin<Statistic, number>;
    declare addStatistics: sqlz.HasManyAddAssociationsMixin<Statistic, number>;
    declare setStatistics: sqlz.HasManySetAssociationsMixin<Statistic, number>;
    declare removeStatistic: sqlz.HasManyRemoveAssociationMixin<Statistic, number>;
    declare removeStatistics: sqlz.HasManyRemoveAssociationsMixin<Statistic, number>;
    declare hasStatistic: sqlz.HasManyHasAssociationMixin<Statistic, number>;
    declare hasStatistics: sqlz.HasManyHasAssociationsMixin<Statistic, number>;
    declare countStatistics: sqlz.HasManyCountAssociationsMixin;
    declare createStatistic: sqlz.HasManyCreateAssociationMixin<Statistic, 'gameId'>;
  
    // belongsTo(Team)
    declare createTeam: sqlz.BelongsToCreateAssociationMixin<Team>;
    declare getTeam: sqlz.BelongsToGetAssociationMixin<Team>;
    declare setTeam: sqlz.BelongsToSetAssociationMixin<Team, number>;
  
    // associated local model
    // none
  }
  
  Game.init({
      id: {
          type: sqlz.DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
      },
      startDate: sqlz.DataTypes.DATE,
      createdAt: sqlz.DataTypes.DATE,
      updatedAt: sqlz.DataTypes.DATE,
  }, {
      sequelize,
      tableName: 'games'
  });