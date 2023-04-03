"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Game extends sequelize_1.Model {
}
exports.Game = Game;
Game.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    startDate: sequelize_1.DataTypes.DATE,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.sequelize,
    tableName: 'games'
});
//# sourceMappingURL=game.js.map