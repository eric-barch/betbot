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
exports.parseFanDuel = void 0;
const globalModels = __importStar(require("../../../../global/models"));
const localModels = __importStar(require("../../../../local/models"));
async function parseFanDuel() {
    const localGamesFromJson = await getlocalGamesFromJson({ exchange: this });
    const localOddsFromDocument = await getLocalOddsFromDocument({ exchange: this, gamesFromJson: localGamesFromJson });
    return localOddsFromDocument;
}
exports.parseFanDuel = parseFanDuel;
async function getlocalGamesFromJson({ exchange, }) {
    let games = new localModels.GameSet;
    // Rewrite this in a more readable way.
    const jsonGamesScriptTag = await exchange.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await exchange.page.evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
    //
    for (const jsonGame of jsonGames) {
        const awayTeamNameString = jsonGame.awayTeam.name;
        const homeTeamNameString = jsonGame.homeTeam.name;
        const awayTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
        const homeTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
        const startDate = new Date(jsonGame.startDate);
        const correspondingGameInstance = await globalModels.allGames.getGameByTeamsAndStartDate({
            awayTeam: awayTeamInstance,
            homeTeam: homeTeamInstance,
            startDate: startDate,
            exchange: exchange,
        });
        games.add(correspondingGameInstance);
    }
    return games;
}
async function getLocalOddsFromDocument({ exchange, gamesFromJson, }) {
    for (const game of gamesFromJson) {
        const odd = await game.getOddByExchange({ exchange: exchange });
        await odd.updateComponentElements();
        await odd.updateComponentValues();
    }
}
//# sourceMappingURL=fanDuel.js.map