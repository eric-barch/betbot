"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new sequelize_1.Sequelize('testdb', 'root', 'f9R#@hY82l', {
            host: 'localhost',
            dialect: 'mysql',
        });
        try {
            yield sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        const GameOdds = sequelize.define('gameOdds', {
            awayTeam: sequelize_1.DataTypes.STRING,
            homeTeam: sequelize_1.DataTypes.STRING,
            date: sequelize_1.DataTypes.DATEONLY,
            fanDuelSpreadAwayPrice: sequelize_1.DataTypes.INTEGER,
            fanDuelSpreadHomePrice: sequelize_1.DataTypes.INTEGER,
            fanDuelSpreadAwaySpread: sequelize_1.DataTypes.FLOAT,
            fanDuelSpreadHomeSpread: sequelize_1.DataTypes.FLOAT,
            fanDuelMoneyAwayPrice: sequelize_1.DataTypes.INTEGER,
            fanDuelMoneyHomePrice: sequelize_1.DataTypes.INTEGER,
            fanDuelOverUnderAwayPrice: sequelize_1.DataTypes.INTEGER,
            fanDuelOverUnderHomePrice: sequelize_1.DataTypes.INTEGER,
            fanDuelOverUnderAwayOver: sequelize_1.DataTypes.FLOAT,
            fanDuelOverUnderHomeUnder: sequelize_1.DataTypes.FLOAT,
        }, {
            timestamps: true,
            updatedAt: false,
            createdAt: 'savedToDatabase',
        });
        yield sequelize.sync({ alter: true });
        yield sequelize.close();
    });
}
main();
