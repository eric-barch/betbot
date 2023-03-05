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
const puppeteer_1 = require("puppeteer");
const models = __importStar(require("../../../models"));
const state = __importStar(require("../../../state"));
//html/body/div[1]/div/div/div/div[2]/div[2]/main/div/div[1]/div/div[2]/div[3]/ul/li[3]/div/div
//html/body/div[1]/div/div/div/div[2]/div[2]/main/div/div[1]/div/div[2]/div[3]/ul/li[3]/div/div/a/div/div[1]/div/div/div/span[1]
const awayTeamXPath = './div[1]/a/div[1]/div/div/div/div[2]/span';
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
        const page = this.getPage();
        const gamesFromJson = yield getGamesFromJson(page); // Returns an array of Game objects based on the JSON from the website.
        const gamesFromJsonWithBaseHandles = yield addBaseHandles(gamesFromJson, page); // Returns an array of ElementHandle objects for the Away Team element of every game in the visible HTML document.
        const gamesFromDocument = yield getGamesFromDocument(gamesFromJsonWithBaseHandles); // Returns an array of Game objects based on visible HTML document.
        return gamesFromDocument;
    });
}
exports.parseFanDuel = parseFanDuel;
function getGamesFromJson(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonGamesScriptTag = yield page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = yield page.evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
        let currentExchangeGames = new Array;
        for (const jsonGame of jsonGames) {
            const awayTeam = state.allTeams.getTeam({
                string: jsonGame.awayTeam.name,
            });
            const homeTeam = state.allTeams.getTeam({
                string: jsonGame.homeTeam.name,
            });
            const startDate = new Date(jsonGame.startDate);
            const currentExchangeGame = state.allGames.getGame({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            currentExchangeGames.push(currentExchangeGame);
        }
        return currentExchangeGames;
    });
}
function addBaseHandles(gamesFromJson, page) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const gameFromJson of gamesFromJson) {
            const jsonGameAwayTeam = gameFromJson.getAwayTeam();
            const jsonGameHomeTeam = gameFromJson.getHomeTeam();
            const jsonGameStartDate = gameFromJson.getStartDate();
            const possibleAwayTeamHandles = yield page.$x(`//span[text()='${jsonGameAwayTeam.getFullName()}' or text()='${jsonGameAwayTeam.getRegionAbbrIdentifierFull()}']`);
            if (possibleAwayTeamHandles.length < 1) {
                console.log(`Did not find span with text ${jsonGameAwayTeam.getFullName()}.`);
            }
            else {
                for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
                    const possibleGameBaseHandle = (yield possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
                    const expectedHomeTeamHandle = (yield possibleGameBaseHandle.$$('xpath/' + homeTeamXPath))[0];
                    if (expectedHomeTeamHandle instanceof puppeteer_1.ElementHandle) {
                        let expectedHomeTeamHandleTextContent;
                        try {
                            expectedHomeTeamHandleTextContent = yield expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
                        }
                        catch (error) {
                            console.log(error);
                        }
                        if (typeof expectedHomeTeamHandleTextContent === 'string') {
                            if (jsonGameHomeTeam.match({ string: expectedHomeTeamHandleTextContent })) {
                                const expectedStartDateHandle = (yield possibleGameBaseHandle.$$('xpath/' + startDateXPath))[0];
                                if (expectedStartDateHandle !== undefined) {
                                    const expectedStartDateHandleTextContent = yield expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());
                                    if (typeof expectedStartDateHandleTextContent === 'string') {
                                        const expectedTimeHandleStartDate = chrono.parseDate(expectedStartDateHandleTextContent);
                                        const diff = Math.abs(expectedTimeHandleStartDate.getTime() - jsonGameStartDate.getTime());
                                        const isWithin5Minutes = diff <= 300000;
                                        if (isWithin5Minutes) {
                                            gameFromJson.setBaseHandle({ baseHandle: possibleGameBaseHandle });
                                            break;
                                        }
                                    }
                                }
                                else {
                                    const currentTime = new Date();
                                    const diff = currentTime.getTime() - jsonGameStartDate.getTime();
                                    const isWithin8HoursBefore = diff <= 28800000;
                                    if (isWithin8HoursBefore) {
                                        gameFromJson.setBaseHandle({ baseHandle: possibleGameBaseHandle });
                                        break;
                                    }
                                }
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        return gamesFromJson;
    });
}
function getGamesFromDocument(gamesFromJsonWithBaseHandles) {
    return __awaiter(this, void 0, void 0, function* () {
        let gamesFromDocument = [];
        for (const gameFromJson of gamesFromJsonWithBaseHandles) {
            const baseHandle = gameFromJson.getBaseHandle();
            if (baseHandle !== undefined) {
                // let className = await baseHandle.evaluate((node) => {
                //     return node.getAttribute('class');
                // });
                const awaySpreadHandle = (yield baseHandle.$$('xpath/' + awaySpreadXPath))[0];
                const awaySpreadTextContent = yield awaySpreadHandle.getProperty('textContent').then(property => property.jsonValue());
                const awaySpreadPriceHandle = (yield baseHandle.$$('xpath/' + awaySpreadPriceXPath))[0];
                const awaySpreadPriceTextContent = yield awaySpreadPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const homeSpreadHandle = (yield baseHandle.$$('xpath/' + homeSpreadXPath))[0];
                const homeSpreadTextContent = yield homeSpreadHandle.getProperty('textContent').then(property => property.jsonValue());
                const homeSpreadPriceHandle = (yield baseHandle.$$('xpath/' + homeSpreadPriceXPath))[0];
                const homeSpreadPriceTextContent = yield homeSpreadPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const awayMoneyPriceHandle = (yield baseHandle.$$('xpath/' + awayMoneyPriceXPath))[0];
                const awayMoneyPriceTextContent = yield awayMoneyPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const homeMoneyPriceHandle = (yield baseHandle.$$('xpath/' + homeMoneyPriceXPath))[0];
                const homeMoneyPriceTextContent = yield homeMoneyPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const overUnderHandle = (yield baseHandle.$$('xpath/' + overUnderXPath))[0];
                const overUnderTextContent = yield overUnderHandle.getProperty('textContent').then(property => property.jsonValue());
                const overPriceHandle = (yield baseHandle.$$('xpath/' + overPriceXPath))[0];
                const overPriceTextContent = yield overPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const underPriceHandle = (yield baseHandle.$$('xpath/' + underPriceXPath))[0];
                const underPriceTextContent = yield underPriceHandle.getProperty('textContent').then(property => property.jsonValue());
                const odds = gameFromJson.getOdds();
                if (odds instanceof models.Odds) {
                    const spreadOdds = odds.getSpreadOdds();
                    const moneyOdds = odds.getMoneyOdds();
                    const overUnderOdds = odds.getOverUnderOdds();
                    spreadOdds.setAwaySpread({ awaySpread: awaySpreadTextContent });
                    spreadOdds.setAwayPrice({ awayPrice: awaySpreadPriceTextContent });
                    spreadOdds.setHomeSpread({ homeSpread: homeSpreadTextContent });
                    spreadOdds.setHomePrice({ homePrice: homeSpreadPriceTextContent });
                    moneyOdds.setAwayPrice({ awayPrice: awayMoneyPriceTextContent });
                    moneyOdds.setHomePrice({ homePrice: homeMoneyPriceTextContent });
                    overUnderOdds.setOverUnder({ overUnder: overUnderTextContent });
                    overUnderOdds.setOverPrice({ overPrice: overPriceTextContent });
                    overUnderOdds.setUnderPrice({ underPrice: underPriceTextContent });
                }
                else {
                    throw new Error('Expected single instance of Odds.');
                }
                gamesFromDocument.push(gameFromJson);
            }
        }
        return gamesFromDocument;
    });
}
//# sourceMappingURL=fanDuel.js.map