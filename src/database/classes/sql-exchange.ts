import * as sequelize from 'sequelize';
import * as database from '..';

export const SqlExchange = database.instance.instance.define('Exchange', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
});
console.log(`Initialized and imported database.classes.SqlExchange.`);