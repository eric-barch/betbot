import * as models from '../models';
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
    
    models.ExchangeSequelizeModel.belongsToMany(models.GameSequelizeModel, {through: 'ExchangeGames'});
    models.GameSequelizeModel.belongsToMany(models.ExchangeSequelizeModel, {through: 'ExchangeGames'});

    models.GameSequelizeModel.hasMany(models.OddsSequelizeModel, {foreignKey: 'gameId'});
    models.OddsSequelizeModel.belongsTo(models.GameSequelizeModel, {foreignKey: 'gameId'});

    models.ExchangeSequelizeModel.hasMany(models.OddsSequelizeModel, {foreignKey: 'exchangeId'});
    models.OddsSequelizeModel.belongsTo(models.ExchangeSequelizeModel, {foreignKey: 'exchangeId'});

    models.OddsSequelizeModel.hasMany(models.oldOddsSequelizeModel, {foreignKey: 'oddsId'});
    models.oldOddsSequelizeModel.belongsTo(models.OddsSequelizeModel, {foreignKey: 'oddsId'});

    await sequelizeInstance.sync({
        alter: true,
        logging: false,
    });
}