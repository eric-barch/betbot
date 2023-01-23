import {Sequelize, DataTypes} from 'sequelize';

async function main() {
    const sequelize = new Sequelize('nfl', 'root', 'f9R#@hY82l', {
        host: 'localhost',
        dialect: 'mysql',
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // Define the Exchange model
    const MySqlExchange = sequelize.define('Exchange', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING
    });

    // Define the Game model
    const MySqlGame = sequelize.define('Game', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        startTime: DataTypes.DATE
    });

    // Define the Odds model
    const MySqlOdds = sequelize.define('Odds', {
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
    const MySqlOddsHistory = sequelize.define('OddsHistory', {
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

    await sequelize.sync({ 
        alter: true, 
        logging: false, 
    });

    await sequelize.close();
}

main();