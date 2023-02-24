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
exports.SqlOddsHistory = void 0;
const sequelize = __importStar(require("sequelize"));
const database = __importStar(require("../../database"));
exports.SqlOddsHistory = database.instance.define('OddsHistory', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    spreadAwaySpread: sequelize.DataTypes.FLOAT,
    spreadHomeSpread: sequelize.DataTypes.FLOAT,
    spreadAwayPrice: sequelize.DataTypes.INTEGER,
    spreadHomePrice: sequelize.DataTypes.INTEGER,
    moneyAwayPrice: sequelize.DataTypes.INTEGER,
    moneyHomePrice: sequelize.DataTypes.INTEGER,
    overUnderOverUnder: sequelize.DataTypes.FLOAT,
    overUnderOverPrice: sequelize.DataTypes.INTEGER,
    overUnderUnderPrice: sequelize.DataTypes.INTEGER,
    scrapedAt: sequelize.DataTypes.DATE(3),
    savedToDatabaseAt: sequelize.DataTypes.DATE(3),
});
console.log(`Initialized and imported database.classes.SqlOddsHistory.`);
