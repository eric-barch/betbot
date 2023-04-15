"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = void 0;
const instance_1 = require("./instance");
const models_1 = require("./models");
async function init() {
    try {
        await instance_1.sequelize.authenticate();
        console.log('MySQL connection successful.');
    }
    catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    // Exchange associations
    // Exchange.belongsToMany(Game, {
    //     through: 'exchange_games',
    //     foreignKey: 'exchangeId',
    //     otherKey: 'gameId',
    // });
    models_1.Exchange.hasMany(models_1.Odd, { foreignKey: 'exchangeId' });
    // Game associations 
    // Game.belongsToMany(Exchange, {
    //     through: 'exchange_games',
    //     foreignKey: 'gameId',
    //     otherKey: 'exchangeId',
    // });
    models_1.Game.hasMany(models_1.Statistic, { foreignKey: 'gameId' });
    models_1.Game.belongsTo(models_1.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    models_1.Game.belongsTo(models_1.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    // Odd associations
    models_1.Odd.belongsTo(models_1.Exchange, { foreignKey: 'exchangeId' });
    models_1.Odd.belongsTo(models_1.Statistic, { foreignKey: 'statisticId' });
    // Statistic associations
    models_1.Statistic.belongsTo(models_1.Game, { foreignKey: 'gameId' });
    models_1.Statistic.hasMany(models_1.Odd, { foreignKey: 'statisticId' });
    // Team associations
    models_1.Team.hasMany(models_1.Game, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    models_1.Team.hasMany(models_1.Game, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    await instance_1.sequelize.sync({
        alter: true,
        logging: false,
    });
}
exports.init = init;
async function close() {
    await instance_1.sequelize.close();
}
exports.close = close;
//# sourceMappingURL=methods.js.map