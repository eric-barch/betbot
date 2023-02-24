import * as sequelize from 'sequelize';
import * as database from '../../database';

export const SqlOdds = database.instance.define('Odds', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    spreadAwaySpread: sequelize.DataTypes.FLOAT,
    spreadHomeSpread: sequelize.DataTypes.FLOAT,
    spreadAwayPrice: sequelize.DataTypes.INTEGER,
    spreadHomePrice: sequelize.DataTypes.INTEGER,
    moneyAwayPrice: sequelize.DataTypes.INTEGER,
    moneyHomePrice: sequelize.DataTypes.INTEGER,
    overUnderOverUnder: sequelize.DataTypes.FLOAT,
    overUnderOverPrice: sequelize.DataTypes.INTEGER,
    overUnderUnderPrice: sequelize.DataTypes.INTEGER,
    scrapedAt: sequelize.DataTypes.DATE(3),
    savedToDatabaseAt: sequelize.DataTypes.DATE(3),
});
console.log(`Initialized and imported database.classes.SqlOdds.`);