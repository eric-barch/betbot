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
exports.OddsSet = void 0;
const models = __importStar(require(".."));
class OddsSet extends Set {
    add(odds) {
        return super.add(odds);
    }
    getOddsByExchangeAndGame({ exchange, game, }) {
        let requestedOdds = undefined;
        for (const odds of this) {
            if (odds.matchesByExchangeAndGame({
                exchange: exchange,
                game: game,
            })) {
                requestedOdds = odds;
                break;
            }
        }
        if (requestedOdds === undefined) {
            requestedOdds = new models.Odds({
                exchange: exchange,
                game: game,
            });
            this.add(requestedOdds);
        }
        return requestedOdds;
    }
}
exports.OddsSet = OddsSet;
//# sourceMappingURL=oddsSet.js.map