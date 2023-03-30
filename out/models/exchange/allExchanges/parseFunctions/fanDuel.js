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
let baseHandle;
function parseFanDuel() {
    return __awaiter(this, void 0, void 0, function* () {
        exchange = this;
        page = this.getPage();
        const gamesFromJson = yield getGamesFromJson();
        const oddsFromDocument = yield getOddsFromDocument(gamesFromJson);
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
            const awayTeam = models.allTeams.getTeamByName({
                string: jsonGame.awayTeam.name,
            });
            const homeTeam = models.allTeams.getTeamByName({
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
function getOddsFromDocument(gamesFromJson) {
    return __awaiter(this, void 0, void 0, function* () {
        let oddsFromDocument = new models.OddsSet;
        let gamesFromDocument = gamesFromJson;
        for (const game of gamesFromDocument) {
            const baseHandle = yield getBaseHandle({ game: game });
            if (baseHandle === null) {
                console.log(`Did not find visible document object for ${game.getAwayTeam().getRegionFullIdentifierFull()} @ ${game.getHomeTeam().getRegionFullIdentifierFull()}.`);
                gamesFromDocument.delete(game);
            }
            else {
                const odds = game.getOddsByExchange({
                    exchange: exchange,
                });
                odds.setBaseHandle({
                    baseHandle: baseHandle,
                });
                oddsFromDocument.add(odds);
            }
        }
        for (const odds of oddsFromDocument) {
            baseHandle = odds.getBaseHandle();
            const awaySpread = yield getElementValue({ xPath: awaySpreadXPath });
            const awaySpreadPrice = yield getElementValue({ xPath: awaySpreadPriceXPath });
            const homeSpread = yield getElementValue({ xPath: homeSpreadPriceXPath });
            const homeSpreadPrice = yield getElementValue({ xPath: homeSpreadPriceXPath });
            const awayMoneyPrice = yield getElementValue({ xPath: awayMoneyPriceXPath });
            const homeMoneyPrice = yield getElementValue({ xPath: homeMoneyPriceXPath });
            const overUnder = yield getElementValue({ xPath: overUnderXPath });
            const overPrice = yield getElementValue({ xPath: overPriceXPath });
            const underPrice = yield getElementValue({ xPath: underPriceXPath });
            const spreadOdds = odds.getSpreadOdds();
            const moneyOdds = odds.getMoneyOdds();
            const overUnderOdds = odds.getOverUnderOdds();
            spreadOdds.setAwaySpread({ awaySpread: awaySpread });
            spreadOdds.setAwayPrice({ awayPrice: awaySpreadPrice });
            spreadOdds.setHomeSpread({ homeSpread: homeSpread });
            spreadOdds.setHomePrice({ homePrice: homeSpreadPrice });
            moneyOdds.setAwayPrice({ awayPrice: awayMoneyPrice });
            moneyOdds.setHomePrice({ homePrice: homeMoneyPrice });
            overUnderOdds.setOverUnder({ overUnder: overUnder });
            overUnderOdds.setOverPrice({ overPrice: overPrice });
            overUnderOdds.setUnderPrice({ underPrice: underPrice });
            odds.setUpdatedAt({ updatedAt: new Date() });
        }
        return oddsFromDocument;
    });
}
function getBaseHandle({ game }) {
    return __awaiter(this, void 0, void 0, function* () {
        let baseHandle;
        const possibleAwayTeamHandles = yield page.$x(`//span[text()='${game.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${game.getAwayTeam().getRegionAbbrIdentifierFull()}']`);
        for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
            const expectedBaseHandle = (yield possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
            const expectedHomeTeamHandle = (yield expectedBaseHandle.$$('xpath/' + homeTeamXPath))[0];
            const expectedStartDateHandle = (yield expectedBaseHandle.$$('xpath/' + startDateXPath))[0];
            const awayTeamText = yield possibleAwayTeamHandle.getProperty('textContent').then(property => property.jsonValue());
            const homeTeamText = yield expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
            let startDateText = yield expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());
            const awayTeam = game.getAwayTeam();
            let homeTeam = game.getHomeTeam();
            let startDate = game.getStartDate();
            if (typeof awayTeamText === 'string' && awayTeam.matchesByNameString({ string: awayTeamText }) &&
                typeof homeTeamText === 'string' && homeTeam.matchesByNameString({ string: homeTeamText }) &&
                typeof startDateText === 'string') {
                startDateText = startDateText.slice(0, -3);
                const startDateParsed = chrono.parseDate(startDateText);
                const startDateParsedRounded = models.Game.roundToNearestInterval(startDateParsed);
                if (startDateParsedRounded.getTime() === startDate.getTime()) {
                    baseHandle = expectedBaseHandle;
                    return baseHandle;
                }
            }
        }
        return null;
    });
}
function getElementValue({ xPath, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elementHandle = (yield baseHandle.$$('xpath/' + xPath))[0];
            const elementTextContent = yield elementHandle.getProperty('textContent').then(property => property.jsonValue());
            const numericTextContent = elementTextContent.replace(/[^\d.-]/g, '');
            const elementValue = Number(numericTextContent);
            return elementValue;
        }
        catch (_a) {
            console.log('Could not find element value.');
        }
        return null;
    });
}
//# sourceMappingURL=fanDuel.js.map