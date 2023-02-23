"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSqlAssociations = void 0;
const database = __importStar(require(".."));
function makeSqlAssociations() {
    database.classes.SqlExchange.belongsToMany(database.classes.SqlGame, { through: 'ExchangeGames' });
    database.classes.SqlGame.belongsToMany(database.classes.SqlExchange, { through: 'ExchangeGames' });
    database.classes.SqlGame.hasMany(database.classes.SqlOdds, { foreignKey: 'gameId' });
    database.classes.SqlOdds.belongsTo(database.classes.SqlGame, { foreignKey: 'gameId' });
    database.classes.SqlExchange.hasMany(database.classes.SqlOdds, { foreignKey: 'exchangeId' });
    database.classes.SqlOdds.belongsTo(database.classes.SqlExchange, { foreignKey: 'exchangeId' });
    database.classes.SqlOdds.hasMany(database.classes.SqlOddsHistory, { foreignKey: 'oddsId' });
    database.classes.SqlOddsHistory.belongsTo(database.classes.SqlOdds, { foreignKey: 'oddsId' });
}
exports.makeSqlAssociations = makeSqlAssociations;
;
console.log(`Initialized and imported database.classes.makeSqlAssociations.`);
