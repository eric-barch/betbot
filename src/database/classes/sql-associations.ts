import * as database from '..';

export function makeSqlAssociations() {
    database.classes.SqlExchange.belongsToMany(database.classes.SqlGame, {through: 'ExchangeGames'});
    database.classes.SqlGame.belongsToMany(database.classes.SqlExchange, {through: 'ExchangeGames'});

    database.classes.SqlGame.hasMany(database.classes.SqlOdds, {foreignKey: 'gameId'});
    database.classes.SqlOdds.belongsTo(database.classes.SqlGame, {foreignKey: 'gameId'});

    database.classes.SqlExchange.hasMany(database.classes.SqlOdds, {foreignKey: 'exchangeId'});
    database.classes.SqlOdds.belongsTo(database.classes.SqlExchange, {foreignKey: 'exchangeId'});

    database.classes.SqlOdds.hasMany(database.classes.SqlOddsHistory, {foreignKey: 'oddsId'});
    database.classes.SqlOddsHistory.belongsTo(database.classes.SqlOdds, {foreignKey: 'oddsId'});
};

console.log(`Initialized and imported database.classes.makeSqlAssociations.`);