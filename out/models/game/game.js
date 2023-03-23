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
exports.Game = void 0;
const models = __importStar(require("../../models"));
class Game {
    constructor({ awayTeam, homeTeam, startDate, }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.startDate = startDate;
        this.exchangesGroup = new models.ExchangeSet;
        this.oddsGroup = new models.OddsSet();
        this.sequelizeInstance = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeInstance = new models.GameSequelizeInstance({ game: this });
            yield this.sequelizeInstance.initialize();
        });
    }
    matchesByTeamsAndStartDate({ awayTeam, homeTeam, startDate, }) {
        if (this.awayTeam === awayTeam && this.homeTeam === homeTeam) {
            const timeDifference = Math.abs(startDate.getTime() - this.getStartDate().getTime());
            const minutesDifference = timeDifference / 1000 / 60;
            const within15Minutes = minutesDifference <= 15;
            if (within15Minutes) {
                return true;
            }
        }
        return false;
    }
    getAwayTeam() {
        return this.awayTeam;
    }
    getHomeTeam() {
        return this.homeTeam;
    }
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
    getStartDate() {
        return this.startDate;
    }
    getExchangesGroup() {
        return this.exchangesGroup;
    }
    getOddsGroup() {
        return this.oddsGroup;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map