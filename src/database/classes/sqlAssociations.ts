import * as database from '../../database';

export function makeSqlAssociations() {
    database.SqlExchange.belongsToMany(database.SqlGame, {through: 'ExchangeGames'});
    database.SqlGame.belongsToMany(database.SqlExchange, {through: 'ExchangeGames'});

    database.SqlGame.hasMany(database.SqlOdds, {foreignKey: 'gameId'});
    database.SqlOdds.belongsTo(database.SqlGame, {foreignKey: 'gameId'});

    database.SqlExchange.hasMany(database.SqlOdds, {foreignKey: 'exchangeId'});
    database.SqlOdds.belongsTo(database.SqlExchange, {foreignKey: 'exchangeId'});

    database.SqlOdds.hasMany(database.SqlOddsHistory, {foreignKey: 'oddsId'});
    database.SqlOddsHistory.belongsTo(database.SqlOdds, {foreignKey: 'oddsId'});
};

console.log(`Initialized and imported database.classes.makeSqlAssociations.`);