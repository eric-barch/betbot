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
exports.GameSet = void 0;
const models = __importStar(require(".."));
class GameSet extends Set {
    add(game) {
        return super.add(game);
    }
    getGameByTeamsAndStartDate({ awayTeam, homeTeam, startDate, }) {
        let requestedGame = undefined;
        startDate = this.roundToNearest15Minute(startDate);
        for (const game of this) {
            if (game.matchesByTeamsAndStartDate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                requestedGame = game;
                break;
            }
        }
        if (requestedGame === undefined) {
            requestedGame = new models.Game({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            this.add(requestedGame);
        }
        return requestedGame;
    }
    roundToNearest15Minute(date) {
        const ROUND_TO_MINUTES = 15;
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_TO_MINUTES) * ROUND_TO_MINUTES;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);
        return roundedDate;
    }
}
exports.GameSet = GameSet;
//# sourceMappingURL=gameSet.js.map