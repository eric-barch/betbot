import * as sequelize from 'sequelize';
import * as database from '../../database';

export const SqlExchange = database.instance.define('SqlExchange', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
});