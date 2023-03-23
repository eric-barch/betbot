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
exports.OddsOldSequelizeInstance = exports.OddsOldSequelizeModel = void 0;
const sequelize = __importStar(require("sequelize"));
const instance_1 = require("../instance");
exports.OddsOldSequelizeModel = instance_1.sequelizeInstance.define('OddsOld', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
class OddsOldSequelizeInstance {
    constructor({ odds, }) {
        this.odds = odds;
        this.sequelizeInstance = null;
    }
    initialize() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeInstance = yield exports.OddsOldSequelizeModel.findOrCreate({
                where: {
                    gameId: (_a = this.getOdds().getGame().getSequelizeInstance()) === null || _a === void 0 ? void 0 : _a.getSequelizeInstance(),
                    exchangeId: (_c = (_b = this.getOdds().getExchange()) === null || _b === void 0 ? void 0 : _b.getSequelizeInstance()) === null || _c === void 0 ? void 0 : _c.getSequelizeInstance(),
                },
                defaults: {
                    gameId: (_d = this.getOdds().getGame().getSequelizeInstance()) === null || _d === void 0 ? void 0 : _d.getSequelizeInstance(),
                    exchangeId: (_f = (_e = this.getOdds().getExchange()) === null || _e === void 0 ? void 0 : _e.getSequelizeInstance()) === null || _f === void 0 ? void 0 : _f.getSequelizeInstance(),
                },
            }).then(([odds, created]) => {
                if (created) {
                    console.log("Odds created: ", odds.get({ plain: true }));
                }
                else {
                    console.log("Odds already exist:", odds.get({ plain: true }));
                }
            });
        });
    }
    getOdds() {
        return this.odds;
    }
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}
exports.OddsOldSequelizeInstance = OddsOldSequelizeInstance;
//# sourceMappingURL=oddsOldSequelize.js.map