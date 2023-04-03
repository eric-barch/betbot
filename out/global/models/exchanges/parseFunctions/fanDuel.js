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
const puppeteer = __importStar(require("puppeteer"));
const globalModels = __importStar(require("../../../../global/models"));
const localModels = __importStar(require("../../../../local/models"));
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
        const localGamesFromJson = yield getlocalGamesFromJson({ exchange: this });
        const localOddsFromDocument = yield getLocalOddsFromDocument({ exchange: this, gamesFromJson: localGamesFromJson });
        return localOddsFromDocument;
    });
}
exports.parseFanDuel = parseFanDuel;
function getlocalGamesFromJson({ exchange, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let games = new localModels.GameSet;
        // Rewrite this in a more readable way.
        const jsonGamesScriptTag = yield exchange.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = yield exchange.page.evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
        //
        for (const jsonGame of jsonGames) {
            const awayTeamNameString = jsonGame.awayTeam.name;
            const homeTeamNameString = jsonGame.homeTeam.name;
            const awayTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
            const homeTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
            const startDate = new Date(jsonGame.startDate);
            const correspondingGameInstance = yield globalModels.allGames.getGameByTeamsAndStartDate({
                awayTeam: awayTeamInstance,
                homeTeam: homeTeamInstance,
                startDate: startDate,
                exchange: exchange,
            });
            games.add(correspondingGameInstance);
        }
        return games;
    });
}
function getLocalOddsFromDocument({ exchange, gamesFromJson, }) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        let oddsFromDocument = new localModels.OddSet;
        const page = exchange.page;
        for (const game of gamesFromJson) {
            const gameName = game.regionFullIdentifierFull;
            const gameTitleElements = yield page.$$(`[title="${gameName}"]`);
            if (gameTitleElements.length === 0) {
                console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
                continue;
            }
            else if (gameTitleElements.length > 2) {
                throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
            }
            const gameElement = yield gameTitleElements[0].getProperty('parentElement');
            if (gameElement instanceof puppeteer.ElementHandle) {
                const awaySpreadSelector = `[aria-label*="${game.awayTeam.name}"][aria-label*="Spread Betting"]`;
                const awaySpreadElement = yield gameElement.$(awaySpreadSelector);
                const awaySpreadAriaLabel = yield ((_a = (yield (awaySpreadElement === null || awaySpreadElement === void 0 ? void 0 : awaySpreadElement.getProperty('ariaLabel')))) === null || _a === void 0 ? void 0 : _a.jsonValue());
                const awayMoneySelector = `[aria-label*="${game.awayTeam.name}"][aria-label*="Moneyline"]`;
                const awayMoneyElement = yield gameElement.$(awayMoneySelector);
                const awayMoneyAriaLabel = yield ((_b = (yield (awayMoneyElement === null || awayMoneyElement === void 0 ? void 0 : awayMoneyElement.getProperty('ariaLabel')))) === null || _b === void 0 ? void 0 : _b.jsonValue());
                const awayTotalSelector = `[aria-label*="${game.awayTeam.name}"][aria-label*="Total Points"]`;
                const awayTotalElement = yield gameElement.$(awayTotalSelector);
                const awayTotalAriaLabel = yield ((_c = (yield (awayTotalElement === null || awayTotalElement === void 0 ? void 0 : awayTotalElement.getProperty('ariaLabel')))) === null || _c === void 0 ? void 0 : _c.jsonValue());
                const homeSpreadSelector = `[aria-label*="${game.homeTeam.name}"][aria-label*="Spread Betting"]`;
                const homeSpreadElement = yield gameElement.$(homeSpreadSelector);
                const homeSpreadAriaLabel = yield ((_d = (yield (homeSpreadElement === null || homeSpreadElement === void 0 ? void 0 : homeSpreadElement.getProperty('ariaLabel')))) === null || _d === void 0 ? void 0 : _d.jsonValue());
                const homeMoneySelector = `[aria-label*="${game.homeTeam.name}"][aria-label*="Moneyline"]`;
                const homeMoneyElement = yield gameElement.$(homeMoneySelector);
                const homeMoneyAriaLabel = yield ((_e = (yield (homeMoneyElement === null || homeMoneyElement === void 0 ? void 0 : homeMoneyElement.getProperty('ariaLabel')))) === null || _e === void 0 ? void 0 : _e.jsonValue());
                const homeTotalSelector = `[aria-label*="${game.homeTeam.name}"][aria-label*="Total Points"]`;
                const homeTotalElement = yield gameElement.$(homeTotalSelector);
                const homeTotalAriaLabel = yield ((_f = (yield (homeTotalElement === null || homeTotalElement === void 0 ? void 0 : homeTotalElement.getProperty('ariaLabel')))) === null || _f === void 0 ? void 0 : _f.jsonValue());
                console.log('foo');
            }
        }
    });
}
function getOddsFromDocument({ exchange, gamesFromJson, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let oddsFromDocument = new localModels.OddSet;
        for (const gameFromJson of gamesFromJson) {
            const baseHandle = yield getBaseHandle({
                exchange: exchange,
                game: gameFromJson,
            });
            if (baseHandle === null) {
                console.log(`${gameFromJson.name} exists in ${exchange.name} JSON games but not in the visible document.`);
            }
            else {
                const odd = yield gameFromJson.getOddByExchange({ exchange: exchange });
                odd.baseHandle = baseHandle;
                const spreadAway = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awaySpreadXPath, odd: odd }) });
                const spreadAwayPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awaySpreadPriceXPath, odd: odd }) });
                const spreadHome = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeSpreadXPath, odd: odd }) });
                const spreadHomePrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeSpreadPriceXPath, odd: odd }) });
                const moneyAwayPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: awayMoneyPriceXPath, odd: odd }) });
                const moneyHomePrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: homeMoneyPriceXPath, odd: odd }) });
                const total = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: overUnderXPath, odd: odd }) });
                const totalOverPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: overPriceXPath, odd: odd }) });
                const totalUnderPrice = yield getElementNumericalValue({ elementHandle: yield getElementHandleByXPath({ xPath: underPriceXPath, odd: odd }) });
                const spreadOdd = odd.spreadOdd;
                const moneyOdd = odd.moneyOdd;
                const overUnderOdd = odd.overUnderOdd;
                spreadOdd.awaySpread = spreadAway;
                spreadOdd.awayPrice = spreadAwayPrice;
                spreadOdd.homeSpread = spreadHome;
                spreadOdd.homePrice = spreadHomePrice;
                moneyOdd.awayPrice = moneyAwayPrice;
                moneyOdd.homePrice = moneyHomePrice;
                overUnderOdd.total = total;
                overUnderOdd.overPrice = totalOverPrice;
                overUnderOdd.underPrice = totalUnderPrice;
                // odd.sqlOdd.update();
                oddsFromDocument.add(odd);
            }
        }
        return oddsFromDocument;
    });
}
function getBaseHandle({ exchange, game }) {
    return __awaiter(this, void 0, void 0, function* () {
        let baseHandle;
        const possibleAwayTeamHandles = yield exchange.page.$x(`//span[text()='${game.awayTeam.regionFullIdentifierFull}' or text()='${game.awayTeam.regionAbbrIdentifierFull}']`);
        for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
            const expectedBaseHandle = (yield possibleAwayTeamHandle.$$('xpath/' + awayTeamToBaseXPath))[0];
            const expectedHomeTeamHandle = (yield expectedBaseHandle.$$('xpath/' + homeTeamXPath))[0];
            const expectedStartDateHandle = (yield expectedBaseHandle.$$('xpath/' + startDateXPath))[0];
            const awayTeamNameString = yield getElementTextValue({ elementHandle: possibleAwayTeamHandle });
            const homeTeamNameString = yield getElementTextValue({ elementHandle: expectedHomeTeamHandle });
            const startDateString = yield getElementTextValue({ elementHandle: expectedStartDateHandle });
            const awayTeam = game.awayTeam;
            const homeTeam = game.homeTeam;
            const startDate = game.startDate;
            const awayTeamMatches = (typeof awayTeamNameString === 'string' && awayTeam.matchesByNameString({ nameString: awayTeamNameString }));
            const homeTeamMatches = (typeof homeTeamNameString === 'string' && homeTeam.matchesByNameString({ nameString: homeTeamNameString }));
            const startDateMatch = (documentStartDate, localStartDate) => {
                if (typeof documentStartDate === 'string') {
                    documentStartDate = documentStartDate.slice(0, -3);
                    const startDateParsed = chrono.parseDate(documentStartDate);
                    const startDateParsedRounded = localModels.Game.roundDateToNearestInterval(startDateParsed);
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
function getElementHandleByXPath({ xPath, odd, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseHandle = odd.baseHandle;
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