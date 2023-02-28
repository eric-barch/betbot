import * as sequelize from 'sequelize';

import * as config from '../config';
import * as database from '../database';

const verbosity = config.verbosity.database['functions.ts'];

export const instance = new sequelize.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

export async function close() {
    const verbose = verbosity.close;

    await instance.close();
}

export async function initialize() {
    const verbose = verbosity.initialize;

    verbose ? console.log(`\nInitiating Sequelize instance.`) : null;

    makeSqlAssociations();
    verbose ? console.log(`Made sequelize class associations.`) : null;

    try {
        await instance.authenticate();
        verbose ? console.log(`MySQL connection established successfully.`) : null;
    } catch (error) {
        verbose ? console.log(`MySQL connection unsuccessful: ${error}`) : null;
    }

    await instance.sync({
        alter: true,
        logging: false,
    });
    verbose ? console.log(`MySql synced to program model.`) : null;
}

function makeSqlAssociations() {
    const verbose = verbosity.makeSqlAssociations;

    database.SqlExchange.belongsToMany(database.SqlGame, {through: 'ExchangeGames'});
    database.SqlGame.belongsToMany(database.SqlExchange, {through: 'ExchangeGames'});

    database.SqlGame.hasMany(database.SqlOdds, {foreignKey: 'gameId'});
    database.SqlOdds.belongsTo(database.SqlGame, {foreignKey: 'gameId'});

    database.SqlExchange.hasMany(database.SqlOdds, {foreignKey: 'exchangeId'});
    database.SqlOdds.belongsTo(database.SqlExchange, {foreignKey: 'exchangeId'});

    database.SqlOdds.hasMany(database.SqlOddsHistory, {foreignKey: 'oddsId'});
    database.SqlOddsHistory.belongsTo(database.SqlOdds, {foreignKey: 'oddsId'});
};