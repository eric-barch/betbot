import * as sequelize from 'sequelize';

import * as database from '../database';
import * as config from '../_config';

export const instance = new sequelize.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});
console.log(`Initialized and imported database.instance.instance.`);

export async function initiate() {
    const verbose = config.verbosity.database.instance.initiate;

    verbose ? console.log(`\nInitiating Sequelize instance.`) : null;

    database.makeSqlAssociations();
    verbose ? console.log(`Made sequelize cla*s associations.`) : null;

    try {
        await database.instance.authenticate();
        verbose ? console.log(`MySQL connection established successfully.`) : null;
    } catch (error) {
        verbose ? console.log(`MySQL connection unsuccessful: ${error}`) : null;
    }

    await database.instance.sync({
        alter: true,
        logging: false,
    });
    verbose ? console.log(`MySql synced to program model.`) : null;
}
console.log(`Initialized and imported database.instance.initiate.`);

export async function close() {
    await instance.close();
}