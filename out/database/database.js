"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});
const models_1 = require("../database/models");
async function init() {
    try {
        await exports.sequelize.authenticate();
        console.log('MySQL connection successful.');
    }
    catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    // Exchange associations
    models_1.Exchange.belongsToMany(models_1.Game, {
        through: 'exchange_games',
        foreignKey: 'exchangeId',
        otherKey: 'gameId',
    });
    models_1.Exchange.hasMany(models_1.Odd, { foreignKey: 'exchangeId' });
    models_1.Exchange.belongsToMany(models_1.Team, {
        through: 'exchange_teams',
        foreignKey: 'exchangeId',
        otherKey: 'teamId',
    });
    // Game associations 
    models_1.Game.belongsToMany(models_1.Exchange, {
        through: 'exchange_games',
        foreignKey: 'gameId',
        otherKey: 'exchangeId',
    });
    models_1.Game.hasMany(models_1.Odd, { foreignKey: 'gameId' });
    models_1.Game.belongsTo(models_1.Team, { as: 'gameAwayTeam', foreignKey: 'awayTeamId' });
    models_1.Game.belongsTo(models_1.Team, { as: 'gameHomeTeam', foreignKey: 'homeTeamId' });
    // Odd associations
    models_1.Odd.belongsTo(models_1.Exchange, { foreignKey: 'exchangeId' });
    models_1.Odd.belongsTo(models_1.Game, { foreignKey: 'gameId' });
    models_1.Odd.belongsTo(models_1.Team, { as: 'oddAwayTeam', foreignKey: 'awayTeamId' });
    models_1.Odd.belongsTo(models_1.Team, { as: 'oddHomeTeam', foreignKey: 'homeTeamId' });
    // Team associations
    models_1.Team.belongsToMany(models_1.Exchange, {
        through: 'exchange_teams',
        foreignKey: 'teamId',
        otherKey: 'exchangeId',
    });
    models_1.Team.hasMany(models_1.Game, { as: 'gameAwayTeam', foreignKey: 'awayTeamId' });
    models_1.Team.hasMany(models_1.Game, { as: 'gameHomeTeam', foreignKey: 'homeTeamId' });
    models_1.Team.hasMany(models_1.Odd, { as: 'oddAwayTeam', foreignKey: 'awayTeamId' });
    models_1.Team.hasMany(models_1.Odd, { as: 'oddHomeTeam', foreignKey: 'homeTeamId' });
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