import * as sequelize from 'sequelize';
import * as database from '../../database';

export const SqlGame = database.instance.define('SqlGame', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: sequelize.DataTypes.STRING,
    homeTeam: sequelize.DataTypes.STRING,
    dateTime: sequelize.DataTypes.DATE
});