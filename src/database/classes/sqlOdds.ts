import * as sequelize from 'sequelize';
import * as database from '../../database';

const exportVerbosity = false;
const exportVerbosityBase = 'database.classes';

export const SqlOdds = database.instance.define('SqlOdds', {
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
exportVerbosity ? console.log(`Exported ${exportVerbosityBase}.${SqlOdds.name}.`) : null;