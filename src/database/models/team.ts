import {
    CreationOptional,
    DataTypes,
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

import { Game } from './game';

export class Team extends Model<
    InferAttributes<Team, {omit: 'games'}>,
    InferCreationAttributes<Team, {omit: 'games'}>
> {
    // id
    declare id: CreationOptional<number>;

    // column headers
    declare regionFull: string;
    declare regionAbbr: string;
    declare identifierFull: string;
    declare identifierAbbr: string;

    // timestamps
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // foreign keys
    // none, all associated sequelize models are plural

    // associated sequelize models
    declare games?: NonAttribute<Game[]>;

    // virtual model associations
    // hasMany(Game)
    declare getGames: HasManyGetAssociationsMixin<Game>;
    declare addGame: HasManyAddAssociationMixin<Game, number>;
    declare addGames: HasManyAddAssociationsMixin<Game, number>;
    declare setGames: HasManySetAssociationsMixin<Game, number>;
    declare removeGame: HasManyRemoveAssociationMixin<Game, number>;
    declare removeGames: HasManyRemoveAssociationsMixin<Game, number>;
    declare hasGame: HasManyHasAssociationMixin<Game, number>;
    declare hasGames: HasManyHasAssociationsMixin<Game, number>;
    declare countGames: HasManyCountAssociationsMixin;
    declare createGame: HasManyCreateAssociationMixin<Game, 'awayTeamId' | 'homeTeamId'>;

    // associated local model
    // none
}

Team.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    regionFull: new DataTypes.STRING(128),
    regionAbbr: new DataTypes.STRING(128),
    identifierFull: new DataTypes.STRING(128),
    identifierAbbr: new DataTypes.STRING(128),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'teams'
});