"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});
const databaseModels = __importStar(require("../database/models"));
async function init() {
    try {
        await exports.sequelize.authenticate();
        console.log('MySQL connection successful.');
    }
    catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    // Exchange associations
    databaseModels.Exchange.belongsToMany(databaseModels.Game, {
        through: 'exchange_games',
        foreignKey: 'exchangeId',
        otherKey: 'gameId',
    });
    databaseModels.Exchange.hasMany(databaseModels.Odd, { foreignKey: 'exchangeId' });
    // Game associations 
    databaseModels.Game.belongsToMany(databaseModels.Exchange, {
        through: 'exchange_games',
        foreignKey: 'gameId',
        otherKey: 'exchangeId',
    });
    databaseModels.Game.hasMany(databaseModels.Statistic, { foreignKey: 'gameId' });
    databaseModels.Game.belongsTo(databaseModels.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    databaseModels.Game.belongsTo(databaseModels.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    // Odd associations
    databaseModels.Odd.belongsTo(databaseModels.Exchange, { foreignKey: 'exchangeId' });
    databaseModels.Odd.belongsTo(databaseModels.Odd, { foreignKey: 'oppositeId' });
    databaseModels.Odd.belongsTo(databaseModels.Statistic, { foreignKey: 'statisticId' });
    // Statistic associations
    databaseModels.Statistic.belongsTo(databaseModels.Game, { foreignKey: 'gameId' });
    databaseModels.Statistic.hasMany(databaseModels.Odd, { foreignKey: 'statisticId' });
    // Team associations
    databaseModels.Team.hasMany(databaseModels.Game, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    databaseModels.Team.hasMany(databaseModels.Game, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    await exports.sequelize.sync({
        alter: true,
        logging: false,
    });
}
exports.init = init;
async function close() {
    await exports.sequelize.close();
}
exports.close = close;
//# sourceMappingURL=database.js.map