"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new sequelize_1.Sequelize('nfl', 'root', 'f9R#@hY82l', {
            host: 'localhost',
            dialect: 'mysql',
        });
        try {
            yield sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        // Define the Exchange model
        const MySqlExchange = sequelize.define('Exchange', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: sequelize_1.DataTypes.STRING
        });
        // Define the Game model
        const MySqlGame = sequelize.define('Game', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: sequelize_1.DataTypes.STRING,
            startTime: sequelize_1.DataTypes.DATE
        });
        // Define the Odds model
        const MySqlOdds = sequelize.define('Odds', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            spreadAwaySpread: sequelize_1.DataTypes.FLOAT,
            spreadHomeSpread: sequelize_1.DataTypes.FLOAT,
            spreadAwayPrice: sequelize_1.DataTypes.INTEGER,
            spreadHomePrice: sequelize_1.DataTypes.INTEGER,
            moneyAwayPrice: sequelize_1.DataTypes.INTEGER,
            moneyHomePrice: sequelize_1.DataTypes.INTEGER,
            overUnderOverUnder: sequelize_1.DataTypes.FLOAT,
            overUnderOverPrice: sequelize_1.DataTypes.INTEGER,
            overUnderUnderPrice: sequelize_1.DataTypes.INTEGER,
            scrapedAt: sequelize_1.DataTypes.DATE(3),
            savedToDatabaseAt: sequelize_1.DataTypes.DATE(3),
        });
        // Define the OddsHistory model
        const MySqlOddsHistory = sequelize.define('OddsHistory', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            spreadAwaySpread: sequelize_1.DataTypes.FLOAT,
            spreadHomeSpread: sequelize_1.DataTypes.FLOAT,
            spreadAwayPrice: sequelize_1.DataTypes.INTEGER,
            spreadHomePrice: sequelize_1.DataTypes.INTEGER,
            moneyAwayPrice: sequelize_1.DataTypes.INTEGER,
            moneyHomePrice: sequelize_1.DataTypes.INTEGER,
            overUnderOverUnder: sequelize_1.DataTypes.FLOAT,
            overUnderOverPrice: sequelize_1.DataTypes.INTEGER,
            overUnderUnderPrice: sequelize_1.DataTypes.INTEGER,
            scrapedAt: sequelize_1.DataTypes.DATE(3),
            savedToDatabaseAt: sequelize_1.DataTypes.DATE(3),
        });
        // Create the associations
        MySqlExchange.hasMany(MySqlGame, { foreignKey: 'exchangeId' });
        MySqlGame.belongsTo(MySqlExchange, { foreignKey: 'exchangeId' });
        MySqlGame.hasMany(MySqlOdds, { foreignKey: 'gameId' });
        MySqlOdds.belongsTo(MySqlGame, { foreignKey: 'gameId' });
        MySqlOdds.hasMany(MySqlOddsHistory, { foreignKey: 'oddsId' });
        MySqlOddsHistory.belongsTo(MySqlOdds, { foreignKey: 'oddsId' });
        yield sequelize.sync({
            alter: true,
            logging: false,
        });
        yield sequelize.close();
    });
}
main();
