import * as sequelize from 'sequelize';
import * as database from '..';

export const SqlGame = database.instance.instance.define('Game', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: sequelize.DataTypes.STRING,
    homeTeam: sequelize.DataTypes.STRING,
    dateTime: sequelize.DataTypes.DATE
});
console.log(`Initialized and imported database.classes.SqlGame.`);