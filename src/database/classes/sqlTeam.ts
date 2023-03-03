import * as sequelize from 'sequelize';
import * as database from '../../database';

export const SqlTeam = database.instance.define('SqlTeam', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});