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
exports.updateStatistics = void 0;
const globalModels = __importStar(require("../../../../../global"));
async function updateStatistics() {
    for (const game of this.gameSet) {
        const spreadAway = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'spread_away',
        });
        this.statisticSet.add(spreadAway);
        const spreadHome = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'spread_home',
        });
        this.statisticSet.add(spreadHome);
        const moneylineAway = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'moneyline_away',
        });
        this.statisticSet.add(moneylineAway);
        const moneylineHome = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'moneyline_home',
        });
        this.statisticSet.add(moneylineHome);
        const totalOver = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'total_over',
        });
        this.statisticSet.add(totalOver);
        const totalUnder = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'total_under',
        });
        this.statisticSet.add(totalUnder);
    }
    return this.statisticSet;
}
exports.updateStatistics = updateStatistics;
//# sourceMappingURL=draftKings.js.map