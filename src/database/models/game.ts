import * as sqlz from 'sequelize';
  
import { sequelize } from '../../database';
  
  import { Exchange } from './exchange';
  import { Outcome } from './outcome';
  import { Team } from './team';
  
  export class Game extends sqlz.Model<
    sqlz.InferAttributes<Game, {omit: 'exchanges' | 'outcomes' | 'awayTeam' | 'homeTeam'}>,
    sqlz.InferCreationAttributes<Game, {omit: 'exchanges' | 'outcomes' | 'awayTeam' | 'homeTeam'}>
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
    declare outcomes?: sqlz.NonAttribute<Outcome[]>;
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
  
    // hasMany(Outcome)
    declare getOutcomes: sqlz.HasManyGetAssociationsMixin<Outcome>;
    declare addOutcome: sqlz.HasManyAddAssociationMixin<Outcome, number>;
    declare addOutcomes: sqlz.HasManyAddAssociationsMixin<Outcome, number>;
    declare setOutcomes: sqlz.HasManySetAssociationsMixin<Outcome, number>;
    declare removeOutcome: sqlz.HasManyRemoveAssociationMixin<Outcome, number>;
    declare removeOutcomes: sqlz.HasManyRemoveAssociationsMixin<Outcome, number>;
    declare hasOutcome: sqlz.HasManyHasAssociationMixin<Outcome, number>;
    declare hasOutcomes: sqlz.HasManyHasAssociationsMixin<Outcome, number>;
    declare countOutcomes: sqlz.HasManyCountAssociationsMixin;
    declare createOutcome: sqlz.HasManyCreateAssociationMixin<Outcome, 'gameId'>;
  
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