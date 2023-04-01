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
    
    databaseModels.SequelizeExchange.belongsToMany(databaseModels.GameSequelizeModel, {through: 'ExchangeGames'});
    databaseModels.GameSequelizeModel.belongsToMany(databaseModels.SequelizeExchange, {through: 'ExchangeGames'});

    databaseModels.GameSequelizeModel.hasMany(databaseModels.OddsSequelizeModel, {foreignKey: 'gameId'});
    databaseModels.OddsSequelizeModel.belongsTo(databaseModels.GameSequelizeModel, {foreignKey: 'gameId'});

    databaseModels.GameSequelizeModel.belongsTo(databaseModels.TeamSequelizeModel, {as: 'awayTeam', foreignKey: 'awayTeamId' });
    databaseModels.GameSequelizeModel.belongsTo(databaseModels.TeamSequelizeModel, {as: 'homeTeam', foreignKey: 'homeTeamId' });

    databaseModels.SequelizeExchange.hasMany(databaseModels.OddsSequelizeModel, {foreignKey: 'exchangeId'});
    databaseModels.OddsSequelizeModel.belongsTo(databaseModels.SequelizeExchange, {foreignKey: 'exchangeId'});

    databaseModels.OddsSequelizeModel.hasMany(databaseModels.oldOddsSequelizeModel, {foreignKey: 'oddsId'});
    databaseModels.oldOddsSequelizeModel.belongsTo(databaseModels.OddsSequelizeModel, {foreignKey: 'oddsId'});

    await sequelizeInstance.sync({
        alter: true,
        logging: false,
    });
}