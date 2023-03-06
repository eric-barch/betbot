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
exports.OddsGroup = void 0;
const models = __importStar(require("../../models"));
const state = __importStar(require("../../state"));
class OddsGroup {
    constructor({ odds, } = {}) {
        if (odds) {
            this.oddsArray = odds;
        }
        else {
            this.oddsArray = [];
        }
    }
    getExchangeGameOdds({ exchange, game, }) {
        let exchangeGameOdds;
        const oddsFromGroup = this.oddsArray.find(oddsGroup => oddsGroup.getExchange() === exchange &&
            oddsGroup.getGame() === game);
        if (oddsFromGroup instanceof models.Odds) {
            exchangeGameOdds = oddsFromGroup;
        }
        else {
            const newOdds = new models.Odds({
                exchange: exchange,
                game: game,
            });
            this.push({ odds: newOdds });
            state.allOdds.push({ odds: newOdds });
            exchangeGameOdds = newOdds;
        }
        return exchangeGameOdds;
    }
    getLength() {
        return this.oddsArray.length;
    }
    push({ odds, }) {
        this.oddsArray.push(odds);
    }
}
exports.OddsGroup = OddsGroup;
//# sourceMappingURL=oddsGroup.js.map