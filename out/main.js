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
const database = __importStar(require("./database"));
const globalModels = __importStar(require("./global"));
const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allStatistics = globalModels.allStatistics;
const allOdds = globalModels.allOdds;
async function main() {
    await database.init();
    await allTeams.init();
    await allExchanges.init();
    await allGames.init();
    await allStatistics.init();
    await allOdds.init();
    while (true) {
        const updateElementsStart = new Date();
        await allOdds.updateElements();
        const updateElementsEnd = new Date();
        const updateElementsDuration = updateElementsEnd.getTime() - updateElementsStart.getTime();
        console.log(`Update elements duration: ${updateElementsDuration}`);
        const updateValuesStart = new Date();
        await allOdds.updateValues();
        const updateValuesEnd = new Date();
        const updateValuesDuration = updateValuesEnd.getTime() - updateValuesStart.getTime();
        console.log(`Update values duration: ${updateValuesDuration}`);
        const totalDuration = updateValuesEnd.getTime() - updateElementsStart.getTime();
        console.log(`Update total duration: ${totalDuration}`);
    }
    process.exit(0);
}
main();
//# sourceMappingURL=main.js.map