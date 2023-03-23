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
exports.GameSequelizeInstance = exports.GameSequelizeModel = void 0;
const sequelize = __importStar(require("sequelize"));
const instance_1 = require("../instance");
exports.GameSequelizeModel = instance_1.sequelizeInstance.define('Game', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: sequelize.DataTypes.STRING,
    homeTeam: sequelize.DataTypes.STRING,
    startDate: sequelize.DataTypes.DATE
});
class GameSequelizeInstance {
    constructor({ game, }) {
        this.game = game;
        this.sequelizeInstance = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeInstance = yield exports.GameSequelizeModel.findOrCreate({
                where: {
                    awayTeam: this.getGame().getAwayTeam(),
                    homeTeam: this.getGame().getHomeTeam(),
                    startDate: this.getGame().getStartDate(),
                },
                defaults: {
                    awayTeam: this.getGame().getAwayTeam(),
                    homeTeam: this.getGame().getHomeTeam(),
                    startDate: this.getGame().getStartDate(),
                },
            }).then(([game, created]) => {
                if (created) {
                    console.log("Game created: ", game.get({ plain: true }));
                }
                else {
                    console.log("Game already exists:", game.get({ plain: true }));
                }
            });
        });
    }
    getGame() {
        return this.game;
    }
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}
exports.GameSequelizeInstance = GameSequelizeInstance;
//# sourceMappingURL=gameSequelize.js.map