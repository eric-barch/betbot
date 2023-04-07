import * as sqlz from 'sequelize';

import { sequelize } from '../database';

import * as databaseModels from '../../database/models';

export class Team extends sqlz.Model<
    sqlz.InferAttributes<Team, {omit: 'games'}>,
    sqlz.InferCreationAttributes<Team, {omit: 'games'}>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare regionFull: string;
    declare regionAbbr: string;
    declare identifierFull: string;
    declare identifierAbbr: string;

    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    // foreign keys
    // none, all associated sequelize models are plural

    // associated sequelize models
    declare games?: sqlz.NonAttribute<databaseModels.Game[]>;

    // virtual model associations
    // hasMany(Game)
    declare getGames: sqlz.HasManyGetAssociationsMixin<databaseModels.Game>;
    declare addGame: sqlz.HasManyAddAssociationMixin<databaseModels.Game, number>;
    declare addGames: sqlz.HasManyAddAssociationsMixin<databaseModels.Game, number>;
    declare setGames: sqlz.HasManySetAssociationsMixin<databaseModels.Game, number>;
    declare removeGame: sqlz.HasManyRemoveAssociationMixin<databaseModels.Game, number>;
    declare removeGames: sqlz.HasManyRemoveAssociationsMixin<databaseModels.Game, number>;
    declare hasGame: sqlz.HasManyHasAssociationMixin<databaseModels.Game, number>;
    declare hasGames: sqlz.HasManyHasAssociationsMixin<databaseModels.Game, number>;
    declare countGames: sqlz.HasManyCountAssociationsMixin;
    declare createGame: sqlz.HasManyCreateAssociationMixin<databaseModels.Game, 'awayTeamId' | 'homeTeamId'>;

    // associated local model
    // none
}

Team.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    regionFull: new sqlz.DataTypes.STRING(128),
    regionAbbr: new sqlz.DataTypes.STRING(128),
    identifierFull: new sqlz.DataTypes.STRING(128),
    identifierAbbr: new sqlz.DataTypes.STRING(128),
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'teams'
});