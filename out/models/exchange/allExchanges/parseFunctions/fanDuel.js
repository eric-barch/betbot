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
exports.parseFanDuel = void 0;
const chrono = __importStar(require("chrono-node"));
const models = __importStar(require("../../../../models"));
const homeTeamXPath = './div[1]/a/div[3]/div/div/div/div[2]/span';
const startDateXPath = './div[2]/div[1]/time';
const awaySpreadXPath = './div[1]/div/div[1]/div[1]/span[1]';
const awaySpreadPriceXPath = './div[1]/div/div[1]/div[1]/span[2]';
const homeSpreadXPath = './div[1]/div/div[2]/div[1]/span[1]';
const homeSpreadPriceXPath = './div[1]/div/div[2]/div[1]/span[2]';
const awayMoneyPriceXPath = './div[1]/div/div[1]/div[2]/span';
const homeMoneyPriceXPath = './div[1]/div/div[2]/div[2]/span';
const overUnderXPath = './div[1]/div/div[1]/div[3]/span[1]';
const overPriceXPath = './div[1]/div/div[1]/div[3]/span[2]';
const underPriceXPath = './div[1]/div/div[2]/div[3]/span[2]';
let exchange;
let page;
let gamesFromJson;
let oddsFromDocument;
function parseFanDuel() {
    return __awaiter(this, void 0, void 0, function* () {
        exchange = this;
        page = this.getPage();
        gamesFromJson = yield getGamesFromJson();
        /**Returns a GameSet based on the JSON from the website.
         * If the Game already exists in AllGames, it pulls that game. If it
         * doesn't, it creates a new game in AllGames and adds the reference
         * to the set. */
        oddsFromDocument = yield getOddsFromDocument();
        /**Returns a set of odds for the games visibly listed on the actual
         * FanDuel page. It uses the JsonGames set as a starting point for
         * which games it should search for in the visible document. If the
         * Odds already exist in AllOdds and the OddsSets for the relevant
         * game and exchange, it pulls that Odds instance and adds it to the
         * return set. If not, it creates the Odds instance and adds it to
         * all three sets and the return set. */
        return oddsFromDocument;
    });
}
exports.parseFanDuel = parseFanDuel;
function getGamesFromJson() {
    return __awaiter(this, void 0, void 0, function* () {
        let gamesFromJson = new models.GameSet;
        const jsonGamesScriptTag = yield page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = yield page.evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
        for (const jsonGame of jsonGames) {
            const awayTeam = models.allTeams.getTeamByNameString({
                string: jsonGame.awayTeam.name,
            });
            const homeTeam = models.allTeams.getTeamByNameString({
                string: jsonGame.homeTeam.name,
            });
            const startDate = new Date(jsonGame.startDate);
            const requestedGame = models.allGames.getGameByTeamsAndStartDate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            gamesFromJson.add(requestedGame);
        }
        return gamesFromJson;
    });
}
function getOddsFromDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        let oddsFromDocument = new models.OddsSet;
        for (const gameFromJson of gamesFromJson) {
            let exchangeGameBaseHandle;
            const possibleAwayTeamHandles = yield page.$x(`//span[text()='${gameFromJson.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${gameFromJson.getAwayTeam().getRegionAbbrIdentifierFull()}']`);
            if (possibleAwayTeamHandles.length < 1) {
                console.log(`Did not find span with text ${gameFromJson.getAwayTeam().getRegionFullIdentifierFull()}.`);
            }
            else {
                exchangeGameBaseHandle = getExchangeGameBaseHandle(possibleAwayTeamHandles, gameFromJson);
                if (exchangeGameBaseHandle !== null) {
                    const requestedOdds = models.allOdds.getOddsByExchangeAndGame({
                        exchange: exchange,
                        game: gameFromJson,
                    });
                    // Populate odds, check for changes, etc.
                    oddsFromDocument.add(requestedOdds);
                }
            }
        }
        return oddsFromDocument;
    });
}
function getExchangeGameBaseHandle(possibleAwayTeamHandles, gameFromJson) {
    return __awaiter(this, void 0, void 0, function* () {
        let exchangeGameBaseHandle;
        for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
            const expectedExchangeGameBaseHandle = (yield possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
            const expectedHomeTeamHandle = (yield expectedExchangeGameBaseHandle.$$('xpath/' + homeTeamXPath))[0];
            const expectedStartDateHandle = (yield expectedExchangeGameBaseHandle.$$('xpath/' + startDateXPath))[0];
            if (!(yield homeTeamMatches(expectedHomeTeamHandle, gameFromJson))) {
                break;
            }
            if (!(yield startDateMatches(expectedStartDateHandle, gameFromJson))) {
                break;
            }
            exchangeGameBaseHandle = expectedExchangeGameBaseHandle;
            return exchangeGameBaseHandle;
        }
        return null;
    });
}
function homeTeamMatches(expectedHomeTeamHandle, gameFromJson) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const textContent = yield expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
            if (typeof textContent === 'string' &&
                gameFromJson.getHomeTeam().matchesByNameString({ string: textContent })) {
                return true;
            }
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
function startDateMatches(expectedStartDateHandle, gameFromJson) {
    return __awaiter(this, void 0, void 0, function* () {
        if (expectedStartDateHandle !== undefined) {
            const expectedStartDateHandleTextContent = yield expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());
            if (typeof expectedStartDateHandleTextContent === 'string') {
                const expectedTimeHandleStartDate = chrono.parseDate(expectedStartDateHandleTextContent);
                const diff = Math.abs(expectedTimeHandleStartDate.getTime() - gameFromJson.getStartDate().getTime());
                const isWithin5Minutes = diff <= 300000;
                if (isWithin5Minutes) {
                    return true;
                }
            }
        }
        else {
            const currentTime = new Date();
            const diff = currentTime.getTime() - gameFromJson.getStartDate().getTime();
            const isWithin8HoursBefore = diff <= 28800000;
            if (isWithin8HoursBefore) {
                return true;
            }
        }
        return false;
    });
}
function getOddsElementContent(gameBaseHandle, xPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const oddsElementHandle = (yield gameBaseHandle.$$('xpath/' + xPath))[0];
        let oddsElementContent;
        try {
            oddsElementContent = yield oddsElementHandle.getProperty('textContent').then(property => property.jsonValue());
        }
        catch (_a) {
            oddsElementContent = '0';
        }
        return oddsElementContent;
    });
}
//# sourceMappingURL=fanDuel.js.map