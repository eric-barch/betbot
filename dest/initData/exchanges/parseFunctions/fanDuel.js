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
exports.fanDuel = void 0;
const state = __importStar(require("../../../state"));
function fanDuel({ verbose = false, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        verbose ? console.log('Parsing FanDuel.') : null;
        const page = this.getPage();
        const scriptElement = yield page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const gamesData = yield page.evaluate(element => JSON.parse(element.textContent), scriptElement);
        verbose ? console.log(`\nParsing games.\nJSON data:`) : null;
        verbose ? console.log(gamesData) : null;
        verbose ? console.log(`Number of games: ${gamesData.length}`) : null;
        let exchangeGames = new Array;
        for (let i = 0; i < gamesData.length; i++) {
            const gameData = gamesData[i];
            verbose ? console.log(`\nGame ${i + 1}:`) : null;
            const awayTeam = state.allTeams.getTeam({
                string: gameData.awayTeam.name,
            });
            verbose ? console.log(`Away team: ${awayTeam.getFullName()}`) : null;
            const homeTeam = state.allTeams.getTeam({
                string: gameData.homeTeam.name,
            });
            verbose ? console.log(`Home team: ${homeTeam.getFullName()}`) : null;
            const startDate = new Date(gameData.startDate);
            verbose ? console.log(`Start date: ${startDate}`) : null;
            const game = state.allGames.getGame({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
                verbose: verbose,
            });
            exchangeGames.push(game);
        }
        verbose ? console.log(`\nexchangeGames.length: ${exchangeGames.length}`) : null;
        verbose ? console.log(`allGames.length: ${state.allGames.getAllGames().length}`) : null;
        for (let exchangeGame of exchangeGames) {
            const awayTeam = exchangeGame.getAwayTeam();
            const spans = yield page.$x(`//span[text()='${awayTeam.getFullName()}' or text()='${awayTeam.getRegionAbbrIdentifierFull()}']`);
            verbose ? console.log(`\n${spans.length} matching span(s) found for ${awayTeam.getFullName()}`) : null;
            if (spans.length === 0) {
            }
            else if (spans.length === 1) {
                const awayTeamSpanHandle = spans[0];
                const nextElementHandle = yield page.evaluateHandle((element) => {
                    let nextNode = element.nextSibling;
                    while (nextNode) {
                        if (nextNode.nodeType === Node.ELEMENT_NODE) {
                            return nextNode;
                        }
                        nextNode = nextNode.nextSibling;
                    }
                    return null;
                }, awayTeamSpanHandle);
            }
            else {
            }
        }
        verbose ? console.log('\nFanDuel parsed.') : null;
        return Promise.resolve();
    });
}
exports.fanDuel = fanDuel;
// for (const spanDataItem of spanData) {
//     const spanText = spanDataItem.text;
//     for (const team of teams) {
//         const teamAbbrName = team.getRegionAbbrIdentifierFull();
//         if (spanText === teamAbbrName) {
//             verbose ? console.log(`\n${spanText} === team.getAbbrName: ${teamAbbrName}`) : null;
//             if (!spanDataItem.recorded) {
//                 spanDataItem.recorded = true;
//                 // Create new Odds and set away team.
//                 let odds = new Odds();
//                 odds.setExchange({exchange: this.getExchange()});
//                 let gameKey = new GameKey();
//                 gameKey.setAwayTeam({
//                     awayTeam: team,
//                 })
//                 const nextSpanText = spanData[spanData.indexOf(spanDataItem) + 1].text;
//                 gameKey.setHomeTeam({
//                     homeTeam: nextSpanText,
//                 })
//                 //html/body/div[1]/div/div/div/div[2]/div[2]/main/div/div[1]/div/div/div[1]/div/div[3]/ul/li[3]/div/div/div[1]/a/div[1]/div/div/div/div[2]/span
//                 // TODO: Find and set game date and time.
//                 for (let i = 2; i <= 11; i++) {
//                     const nextSpanDataItem = spanData[spanData.indexOf(spanDataItem) + i];
//                     nextSpanDataItem.recorded = true;
//                     const nextSpanText = nextSpanDataItem.text;
//                     verbose ? console.log(`Span text: ${nextSpanText}`) : null;
//                     switch(i) {
//                         case 2: {
//                             // Set spreadOdds.awaySpread.
//                             let odds = game.getOdds({
//                                 exchanges: this.getExchange(),
//                             }) as Odds;
//                             odds.getSpreadOdds().setAwaySpread({awaySpread: nextSpanText, verbose: verbose});
//                             break;
//                         }
//                         case 3: {
//                             // Set spreadOdds.awayPrice.
//                             let odds = game.getOdds({
//                                 exchanges: this.getExchange(),
//                             }) as Odds;
//                             odds.getSpreadOdds().setAwayPrice({awayPrice: nextSpanText, verbose: verbose});
//                             break;
//                         }
//                         case 4: {
//                             // Set moneyOdds.awayPrice.
//                             break;
//                         }
//                         case 5: {
//                             // Set overUnderOdds.overUnder.
//                             break;
//                         }
//                         case 6: {
//                             // Set overUnderOdds.overPrice.
//                             break;
//                         }
//                         case 7: {
//                             // Set spreadOdds.homeSpread.
//                             break;
//                         }
//                         case 8: {
//                             // Set spreadOdds.homePrice.
//                             break;
//                         }
//                         case 9: {
//                             // Set moneyOdds.homePrice.
//                             break;
//                         }
//                         case 10: {
//                             // Do nothing or confirm overUnderOdds.overUnder.
//                             break;
//                         }
//                         case 11: {
//                             // Set overUnderOdds.underPrice.
//                             break;
//                         }
//                     }
//                 }
//                 verbose ? console.log(`\nGame exchanges: ${game.getExchanges().length}`) : null;
//                 verbose ? console.log(`Game odds: ${(game.getOdds() as Array<Odds>).length}`) : null;
//                 let exchange = this.getExchange();
//                 exchange.setGames({
//                     games: game, 
//                     verbose: verbose
//                 });
//                 exchange.setCurrentOdds({
//                     currentOdds: game.getOdds({
//                         exchanges: exchange,
//                         verbose: verbose,
//                     }) as Array<Odds>,
//                     verbose: verbose,
//                 });
//                 verbose ? console.log(`\nExchange games: ${exchange.getGames().length}`) : null;
//                 verbose ? console.log(`Exchange current odds: ${exchange.getCurrentOdds().length}`) : null;
//             } else {
//                 console.log(`${spanText} span already recorded.`)
//             }
//         } else {
//             // console.log(`${spanText} != ${fullName} or ${abbrName}`);
//         }
//     }
// }
