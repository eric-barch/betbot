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
exports.initialize = exports.close = void 0;
const databaseModels = __importStar(require("./models"));
const instance_1 = require("./instance");
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.sequelizeInstance.close();
    });
}
exports.close = close;
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield instance_1.sequelizeInstance.authenticate();
            console.log('MySQL connection successful.');
        }
        catch (error) {
            console.log(`MySQL connection unsuccessful: ${error}`);
        }
        databaseModels.ExchangeSequelizeModel.belongsToMany(databaseModels.GameSequelizeModel, { through: 'ExchangeGames' });
        databaseModels.GameSequelizeModel.belongsToMany(databaseModels.ExchangeSequelizeModel, { through: 'ExchangeGames' });
        databaseModels.GameSequelizeModel.hasMany(databaseModels.OddsSequelizeModel, { foreignKey: 'gameId' });
        databaseModels.OddsSequelizeModel.belongsTo(databaseModels.GameSequelizeModel, { foreignKey: 'gameId' });
        databaseModels.GameSequelizeModel.belongsTo(databaseModels.TeamSequelizeModel, { as: 'awayTeam', foreignKey: 'awayTeamId' });
        databaseModels.GameSequelizeModel.belongsTo(databaseModels.TeamSequelizeModel, { as: 'homeTeam', foreignKey: 'homeTeamId' });
        databaseModels.ExchangeSequelizeModel.hasMany(databaseModels.OddsSequelizeModel, { foreignKey: 'exchangeId' });
        databaseModels.OddsSequelizeModel.belongsTo(databaseModels.ExchangeSequelizeModel, { foreignKey: 'exchangeId' });
        databaseModels.OddsSequelizeModel.hasMany(databaseModels.oldOddsSequelizeModel, { foreignKey: 'oddsId' });
        databaseModels.oldOddsSequelizeModel.belongsTo(databaseModels.OddsSequelizeModel, { foreignKey: 'oddsId' });
        yield instance_1.sequelizeInstance.sync({
            alter: true,
            logging: false,
        });
    });
}
exports.initialize = initialize;
//# sourceMappingURL=methods.js.map