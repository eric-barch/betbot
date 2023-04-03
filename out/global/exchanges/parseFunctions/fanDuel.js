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
const global = __importStar(require("../../../global"));
const models = __importStar(require("../../../models"));
const awayTeamToBaseXPath = '../../../../../../../..';
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
function parseFanDuel() {
    return __awaiter(this, void 0, void 0, function* () {
        const gamesFromJson = yield getGameInstancesFromJson({ exchange: this });
        const oddsFromDocument = yield getOddsInstancesFromDocument({ exchange: this, gamesFromJson: gamesFromJson });
        return oddsFromDocument;
    });
}
exports.parseFanDuel = parseFanDuel;
function getGameInstancesFromJson({ exchange, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let gameInstances = new models.GameSet;
        // Rewrite this in a more readable way.
        const jsonGamesScriptTag = yield exchange.getPage().$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = yield exchange.getPage().evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
        for (const jsonGame of jsonGames) {
            const awayTeamNameString = jsonGame.awayTeam.name;
            const homeTeamNameString = jsonGame.homeTeam.name;
            const awayTeamInstance = global.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
            const homeTeamInstance = global.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
            const startDate = new Date(jsonGame.startDate);
            const correspondingGameInstance = yield global.allGames.getGameByTeamsAndStartDate({
                awayTeam: awayTeamInstance,
                homeTeam: homeTeamInstance,
                startDate: startDate,
                exchange: exchange,
            });
            gameInstances.add(correspondingGameInstance);
        }
        return gameInstances;
    });
}
function getOddsInstancesFromDocument({ exchange, gamesFromJson, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let oddsFromDocument = new models.OddsSet;
        for (const gameFromJson of gamesFromJson) {
            const baseHandle = yield getBaseHandle({
                exchange: exchange,
                game: gameFromJson,
            });
            if (baseHandle === null) {
                console.log(`${gameFromJson.getName()} exists in the JSON games for ${exchange.getName()} but not in the visible document.`);
            }
            else {
                const odds = yield gameFromJson.getOddsByExchange({ exchange: exchange });
                odds.setBaseHandle({ baseHandle: baseHandle });
                const awaySpread = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awaySpreadXPath, odds: odds }) });
                const awaySpreadPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awaySpreadPriceXPath, odds: odds }) });
                const homeSpread = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeSpreadXPath, odds: odds }) });
                const homeSpreadPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeSpreadPriceXPath, odds: odds }) });
                const awayMoneyPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awayMoneyPriceXPath, odds: odds }) });
                const homeMoneyPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeMoneyPriceXPath, odds: odds }) });
                const overUnder = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: overUnderXPath, odds: odds }) });
                const overPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: overPriceXPath, odds: odds }) });
                const underPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: underPriceXPath, odds: odds }) });
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
                yield odds.initialize();
                oddsFromDocument.add(odds);
            }
        }
        return oddsFromDocument;
    });
}
function getBaseHandle({ exchange, game }) {
    return __awaiter(this, void 0, void 0, function* () {
        let baseHandle;
        const possibleAwayTeamHandles = yield exchange.getPage().$x(`//span[text()='${game.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${game.getAwayTeam().getRegionAbbrIdentifierFull()}']`);
        for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
            const expectedBaseHandle = (yield possibleAwayTeamHandle.$$('xpath/' + awayTeamToBaseXPath))[0];
            const expectedHomeTeamHandle = (yield expectedBaseHandle.$$('xpath/' + homeTeamXPath))[0];
            const expectedStartDateHandle = (yield expectedBaseHandle.$$('xpath/' + startDateXPath))[0];
            const awayTeamNameString = yield getElementTextValue({ elementHandle: possibleAwayTeamHandle });
            const homeTeamNameString = yield getElementTextValue({ elementHandle: expectedHomeTeamHandle });
            const startDateString = yield getElementTextValue({ elementHandle: expectedStartDateHandle });
            const awayTeam = game.getAwayTeam();
            const homeTeam = game.getHomeTeam();
            const startDate = game.getStartDate();
            const awayTeamMatches = (typeof awayTeamNameString === 'string' && awayTeam.matchesByNameString({ nameString: awayTeamNameString }));
            const homeTeamMatches = (typeof homeTeamNameString === 'string' && homeTeam.matchesByNameString({ nameString: homeTeamNameString }));
            const startDateMatch = (documentStartDate, localStartDate) => {
                if (typeof documentStartDate === 'string') {
                    documentStartDate = documentStartDate.slice(0, -3);
                    const startDateParsed = chrono.parseDate(documentStartDate);
                    const startDateParsedRounded = models.Game.roundToNearestInterval(startDateParsed);
                    if (startDateParsedRounded.getTime() === localStartDate.getTime()) {
                        return true;
                    }
                }
                return false;
            };
            const startDateMatches = startDateMatch(startDateString, startDate);
            if (awayTeamMatches && homeTeamMatches && startDateMatches) {
                baseHandle = expectedBaseHandle;
                return baseHandle;
            }
        }
        return null;
    });
}
function getElementHandleByXPath({ xPath, odds, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseHandle = odds.getBaseHandle();
        const elementHandle = (yield baseHandle.$$('xpath/' + xPath))[0];
        return elementHandle;
    });
}
function getElementTextValue({ elementHandle, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elementTextContent = yield elementHandle.getProperty('textContent').then(property => property.jsonValue());
            return elementTextContent;
        }
        catch (_a) {
            // console.log('Could not find element text value.');
        }
        return null;
    });
}
function getElementNumericalValue({ elementHandle, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elementTextContent = yield elementHandle.getProperty('textContent').then(property => property.jsonValue());
            const numericTextContent = elementTextContent.replace(/[^\d.-]/g, '');
            const elementValue = Number(numericTextContent);
            if (elementValue) {
                return elementValue;
            }
        }
        catch (_a) {
            // console.log('Could not find element numerical value.');
        }
        return null;
    });
}
//# sourceMappingURL=fanDuel.js.map