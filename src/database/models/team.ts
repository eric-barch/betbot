import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Game } from './game';

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
    declare games?: sqlz.NonAttribute<Game[]>;

    // virtual model associations
    // hasMany(Game)
    declare getGames: sqlz.HasManyGetAssociationsMixin<Game>;
    declare addGame: sqlz.HasManyAddAssociationMixin<Game, number>;
    declare addGames: sqlz.HasManyAddAssociationsMixin<Game, number>;
    declare setGames: sqlz.HasManySetAssociationsMixin<Game, number>;
    declare removeGame: sqlz.HasManyRemoveAssociationMixin<Game, number>;
    declare removeGames: sqlz.HasManyRemoveAssociationsMixin<Game, number>;
    declare hasGame: sqlz.HasManyHasAssociationMixin<Game, number>;
    declare hasGames: sqlz.HasManyHasAssociationsMixin<Game, number>;
    declare countGames: sqlz.HasManyCountAssociationsMixin;
    declare createGame: sqlz.HasManyCreateAssociationMixin<Game, 'awayTeamId' | 'homeTeamId'>;

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