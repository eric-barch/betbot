import * as sequelize from 'sequelize';

import * as database from '../database';

export const instance = new sequelize.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

export async function close() {
    await instance.close();
}

export async function initialize() {
    makeSqlAssociations();

    try {
        await instance.authenticate();
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }

    await instance.sync({
        alter: true,
        logging: false,
    });
}

function makeSqlAssociations() {
    database.SqlExchange.belongsToMany(database.SqlGame, {through: 'SqlExchangeGames'});
    database.SqlGame.belongsToMany(database.SqlExchange, {through: 'SqlExchangeGames'});

    database.SqlGame.hasMany(database.SqlOdds, {foreignKey: 'gameId'});
    database.SqlOdds.belongsTo(database.SqlGame, {foreignKey: 'gameId'});

    database.SqlExchange.hasMany(database.SqlOdds, {foreignKey: 'exchangeId'});
    database.SqlOdds.belongsTo(database.SqlExchange, {foreignKey: 'exchangeId'});

    database.SqlOdds.hasMany(database.SqlOddsHistory, {foreignKey: 'oddsId'});
    database.SqlOddsHistory.belongsTo(database.SqlOdds, {foreignKey: 'oddsId'});
};