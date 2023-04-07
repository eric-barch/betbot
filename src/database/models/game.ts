import * as sqlz from 'sequelize';
  
  import { sequelize } from '../database';
  
  import * as databaseModels from '../../database/models';
  
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
    declare awayTeamId: sqlz.ForeignKey<databaseModels.Team['id']>;
    declare homeTeamId: sqlz.ForeignKey<databaseModels.Team['id']>;
  
    // associated sequelize models
    declare exchanges?: sqlz.NonAttribute<databaseModels.Exchange[]>;
    declare statistics?: sqlz.NonAttribute<databaseModels.Statistic[]>;
    declare awayTeam?: sqlz.NonAttribute<databaseModels.Team>;
    declare homeTeam?: sqlz.NonAttribute<databaseModels.Team>;
  
    // virtual model associations
    // belongsToMany(Exchange)
    declare getExchanges: sqlz.BelongsToManyGetAssociationsMixin<databaseModels.Exchange>;
    declare addExchange: sqlz.BelongsToManyAddAssociationMixin<databaseModels.Exchange, number>;
    declare addExchanges: sqlz.BelongsToManyAddAssociationsMixin<databaseModels.Exchange, number>;
    declare setExchanges: sqlz.BelongsToManySetAssociationsMixin<databaseModels.Exchange, number>;
    declare removeExchange: sqlz.BelongsToManyRemoveAssociationMixin<databaseModels.Exchange, number>;
    declare removeExchanges: sqlz.BelongsToManyRemoveAssociationsMixin<databaseModels.Exchange, number>;
    declare hasExchange: sqlz.BelongsToManyHasAssociationMixin<databaseModels.Exchange, number>;
    declare hasExchanges: sqlz.BelongsToManyHasAssociationsMixin<databaseModels.Exchange, number>;
    declare countExchanges: sqlz.BelongsToManyCountAssociationsMixin;
    declare createExchange: sqlz.BelongsToManyCreateAssociationMixin<databaseModels.Exchange>;
  
    // hasMany(Statistic)
    declare getStatistics: sqlz.HasManyGetAssociationsMixin<databaseModels.Statistic>;
    declare addStatistic: sqlz.HasManyAddAssociationMixin<databaseModels.Statistic, number>;
    declare addStatistics: sqlz.HasManyAddAssociationsMixin<databaseModels.Statistic, number>;
    declare setStatistics: sqlz.HasManySetAssociationsMixin<databaseModels.Statistic, number>;
    declare removeStatistic: sqlz.HasManyRemoveAssociationMixin<databaseModels.Statistic, number>;
    declare removeStatistics: sqlz.HasManyRemoveAssociationsMixin<databaseModels.Statistic, number>;
    declare hasStatistic: sqlz.HasManyHasAssociationMixin<databaseModels.Statistic, number>;
    declare hasStatistics: sqlz.HasManyHasAssociationsMixin<databaseModels.Statistic, number>;
    declare countStatistics: sqlz.HasManyCountAssociationsMixin;
    declare createStatistic: sqlz.HasManyCreateAssociationMixin<databaseModels.Statistic, 'gameId'>;
  
    // belongsTo(Team)
    declare createTeam: sqlz.BelongsToCreateAssociationMixin<databaseModels.Team>;
    declare getTeam: sqlz.BelongsToGetAssociationMixin<databaseModels.Team>;
    declare setTeam: sqlz.BelongsToSetAssociationMixin<databaseModels.Team, number>;
  
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