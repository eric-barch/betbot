import {Sequelize, DataTypes} from 'sequelize';

export const sequelize = new Sequelize('nfl', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the Exchange model
export const MySqlExchange = sequelize.define('Exchange', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    url: DataTypes.STRING,
});

// Define the Game model
export const MySqlGame = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: DataTypes.STRING,
    homeTeam: DataTypes.STRING,
    dateTime: DataTypes.DATE
});

// Define the Odds model
export const MySqlOdds = sequelize.define('Odds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    spreadAwaySpread: DataTypes.FLOAT,
    spreadHomeSpread: DataTypes.FLOAT,
    spreadAwayPrice: DataTypes.INTEGER,
    spreadHomePrice: DataTypes.INTEGER,
    moneyAwayPrice: DataTypes.INTEGER,
    moneyHomePrice: DataTypes.INTEGER,
    overUnderOverUnder: DataTypes.FLOAT,
    overUnderOverPrice: DataTypes.INTEGER,
    overUnderUnderPrice: DataTypes.INTEGER,
    scrapedAt: DataTypes.DATE(3),
    savedToDatabaseAt: DataTypes.DATE(3),
});

// Define the OddsHistory model
export const MySqlOddsHistory = sequelize.define('OddsHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
        spreadAwaySpread: DataTypes.FLOAT,
        spreadHomeSpread: DataTypes.FLOAT,
        spreadAwayPrice: DataTypes.INTEGER,
        spreadHomePrice: DataTypes.INTEGER,
        moneyAwayPrice: DataTypes.INTEGER,
        moneyHomePrice: DataTypes.INTEGER,
        overUnderOverUnder: DataTypes.FLOAT,
        overUnderOverPrice: DataTypes.INTEGER,
        overUnderUnderPrice: DataTypes.INTEGER,
        scrapedAt: DataTypes.DATE(3),
        savedToDatabaseAt: DataTypes.DATE(3),
});

// Create the associations
MySqlExchange.hasMany(MySqlGame, { foreignKey: 'exchangeId' });
MySqlGame.belongsTo(MySqlExchange, { foreignKey: 'exchangeId' });

MySqlGame.hasMany(MySqlOdds, { foreignKey: 'gameId' });
MySqlOdds.belongsTo(MySqlGame, { foreignKey: 'gameId' });

MySqlOdds.hasMany(MySqlOddsHistory, { foreignKey: 'oddsId' });
MySqlOddsHistory.belongsTo(MySqlOdds, { foreignKey: 'oddsId' });