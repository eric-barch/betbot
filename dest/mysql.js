"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlOddsHistory = exports.MySqlOdds = exports.MySqlGame = exports.MySqlExchange = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('nfl', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    dialect: 'mysql',
});
// Define the Exchange model
exports.MySqlExchange = exports.sequelize.define('Exchange', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize_1.DataTypes.STRING,
    url: sequelize_1.DataTypes.STRING,
});
// Define the Game model
exports.MySqlGame = exports.sequelize.define('Game', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: sequelize_1.DataTypes.STRING,
    homeTeam: sequelize_1.DataTypes.STRING,
    dateTime: sequelize_1.DataTypes.DATE
});
// Define the Odds model
exports.MySqlOdds = exports.sequelize.define('Odds', {
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
exports.MySqlOddsHistory = exports.sequelize.define('OddsHistory', {
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
exports.MySqlExchange.hasMany(exports.MySqlGame, { foreignKey: 'exchangeId' });
exports.MySqlGame.belongsTo(exports.MySqlExchange, { foreignKey: 'exchangeId' });
exports.MySqlGame.hasMany(exports.MySqlOdds, { foreignKey: 'gameId' });
exports.MySqlOdds.belongsTo(exports.MySqlGame, { foreignKey: 'gameId' });
exports.MySqlOdds.hasMany(exports.MySqlOddsHistory, { foreignKey: 'oddsId' });
exports.MySqlOddsHistory.belongsTo(exports.MySqlOdds, { foreignKey: 'oddsId' });
