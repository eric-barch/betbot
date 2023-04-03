"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Exchange extends sequelize_1.Model {
}
exports.Exchange = Exchange;
Exchange.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: new sequelize_1.DataTypes.STRING(128),
    url: new sequelize_1.DataTypes.STRING(128),
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.sequelize,
    tableName: 'exchanges',
});
//# sourceMappingURL=exchange.js.map