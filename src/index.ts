import { Sequelize, DataTypes, Model } from 'sequelize';

async function main() {
    const sequelize = new Sequelize('testdb', 'root', 'f9R#@hY82l', {
        host: 'localhost',
        dialect: 'mysql',
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    const GameOdds = sequelize.define('gameOdds', {
        awayTeam: DataTypes.STRING,
        homeTeam: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        fanDuelSpreadAwayPrice: DataTypes.INTEGER,
        fanDuelSpreadHomePrice: DataTypes.INTEGER,
        fanDuelSpreadAwaySpread: DataTypes.FLOAT,
        fanDuelSpreadHomeSpread: DataTypes.FLOAT,
        fanDuelMoneyAwayPrice: DataTypes.INTEGER,
        fanDuelMoneyHomePrice: DataTypes.INTEGER,
        fanDuelOverUnderAwayPrice: DataTypes.INTEGER,
        fanDuelOverUnderHomePrice: DataTypes.INTEGER,
        fanDuelOverUnderAwayOver: DataTypes.FLOAT,
        fanDuelOverUnderHomeUnder: DataTypes.FLOAT,
    }, {
        timestamps: true,
        updatedAt: false,
        createdAt: 'savedToDatabase',
    })

    await sequelize.sync({ alter: true });

    await sequelize.close();
}

main();