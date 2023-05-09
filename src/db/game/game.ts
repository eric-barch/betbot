import * as s from 'sequelize';

import { sequelize } from '../instance';
import * as db from '../../db';

export class Game extends s.Model<
    s.InferAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>,
    s.InferCreationAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>
> {
    declare id: s.CreationOptional<Date>;
    declare startDate: Date;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare awayTeamId: s.ForeignKey<db.Team['id']>;
    declare homeTeamId: s.ForeignKey<db.Team['id']>;
    declare awayTeam: db.Team;
    declare homeTeam: db.Team;

    // belongsTo(Team)
    declare createTeam: s.BelongsToCreateAssociationMixin<db.Team>;
    declare getTeam: s.BelongsToGetAssociationMixin<db.Team>;
    declare setTeam: s.BelongsToSetAssociationMixin<db.Team, number>;
}

Game.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    startDate: s.DataTypes.DATE,
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'Games'
})