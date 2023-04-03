"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odd = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Odd extends sequelize_1.Model {
}
exports.Odd = Odd;
Odd.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    spreadAwaySpread: sequelize_1.DataTypes.FLOAT,
    spreadHomeSpread: sequelize_1.DataTypes.FLOAT,
    spreadAwayPrice: sequelize_1.DataTypes.INTEGER,
    spreadHomePrice: sequelize_1.DataTypes.INTEGER,
    moneyAwayPrice: sequelize_1.DataTypes.INTEGER,
    moneyHomePrice: sequelize_1.DataTypes.INTEGER,
    totalTotal: sequelize_1.DataTypes.FLOAT,
    totalOverPrice: sequelize_1.DataTypes.INTEGER,
    totalUnderPrice: sequelize_1.DataTypes.INTEGER,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.sequelize,
    tableName: 'odds',
});
//# sourceMappingURL=odd.js.map