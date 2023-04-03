"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Team extends sequelize_1.Model {
}
exports.Team = Team;
Team.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    regionFull: new sequelize_1.DataTypes.STRING(128),
    regionAbbr: new sequelize_1.DataTypes.STRING(128),
    identifierFull: new sequelize_1.DataTypes.STRING(128),
    identifierAbbr: new sequelize_1.DataTypes.STRING(128),
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.sequelize,
    tableName: 'teams'
});
//# sourceMappingURL=team.js.map