import * as databaseModels from './models';
import { sequelizeInstance } from './instance';

export async function close() {
    await sequelizeInstance.close();
}

export async function initialize() {
    try {
        await sequelizeInstance.authenticate();
        console.log('MySQL connection successful.');
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    
    databaseModels.ExchangeSequelizeModel.belongsToMany(databaseModels.GameSequelizeModel, {through: 'ExchangeGames'});
    databaseModels.GameSequelizeModel.belongsToMany(databaseModels.ExchangeSequelizeModel, {through: 'ExchangeGames'});

    databaseModels.GameSequelizeModel.hasMany(databaseModels.OddsSequelizeModel, {foreignKey: 'gameId'});
    databaseModels.OddsSequelizeModel.belongsTo(databaseModels.GameSequelizeModel, {foreignKey: 'gameId'});

    databaseModels.ExchangeSequelizeModel.hasMany(databaseModels.OddsSequelizeModel, {foreignKey: 'exchangeId'});
    databaseModels.OddsSequelizeModel.belongsTo(databaseModels.ExchangeSequelizeModel, {foreignKey: 'exchangeId'});

    databaseModels.OddsSequelizeModel.hasMany(databaseModels.oldOddsSequelizeModel, {foreignKey: 'oddsId'});
    databaseModels.oldOddsSequelizeModel.belongsTo(databaseModels.OddsSequelizeModel, {foreignKey: 'oddsId'});

    await sequelizeInstance.sync({
        alter: true,
        logging: false,
    });
}