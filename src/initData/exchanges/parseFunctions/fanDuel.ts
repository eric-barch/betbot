import * as config from '../../../config';
import * as models from '../../../models';
import * as state from '../../../state';

export async function fanDuel(this: models.ExchangePageParser) {
    const page = this.getPage()!;

    const scriptElement = await page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const gamesData = await page.evaluate(element => JSON.parse(element!.textContent!), scriptElement);

    let exchangeGames = new Array<models.Game>;

    for (let i = 0; i < gamesData.length; i++) {
        const gameData = gamesData[i];
        
        const awayTeam = state.allTeams.getTeam({
            string: gameData.awayTeam.name,
        });
    
        const homeTeam = state.allTeams.getTeam({
            string: gameData.homeTeam.name,
        })

        const startDate = new Date(gameData.startDate);

        const game = state.allGames.getGame({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });

        exchangeGames.push(game);
    }

    for (let exchangeGame of exchangeGames) {
        const awayTeam = exchangeGame.getAwayTeam();
        const spans = await page.$x(`//span[text()='${awayTeam.getFullName()}' or text()='${awayTeam.getRegionAbbrIdentifierFull()}']`);
        
        if (spans.length === 0) {

        } else if (spans.length === 1) {
            const awayTeamSpanHandle = spans[0];
            
            const nextElementHandle = await page.evaluateHandle((element) => {
                let nextNode = element.nextSibling;
                while (nextNode) {
                    if (nextNode.nodeType === Node.ELEMENT_NODE) {
                        return nextNode;
                    }
                    nextNode = nextNode.nextSibling;
                }
                return null;
            }, awayTeamSpanHandle);


            
        } else {

        }
    }

    return Promise.resolve();
}




// for (const spanDataItem of spanData) {
//     const spanText = spanDataItem.text;
//     for (const team of teams) {
//         const teamAbbrName = team.getRegionAbbrIdentifierFull();
//         if (spanText === teamAbbrName) {

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

//                         case 2: {
//                             // Set spreadOdds.awaySpread.
//                             let odds = game.getOdds({
//                                 exchanges: this.getExchange(),
//                             }) as Odds;
//                             odds.getSpreadOdds().setAwaySpread({awaySpread: nextSpanText});
//                             break;
//                         }
//                         case 3: {
//                             // Set spreadOdds.awayPrice.
//                             let odds = game.getOdds({
//                                 exchanges: this.getExchange(),
//                             }) as Odds;
//                             odds.getSpreadOdds().setAwayPrice({awayPrice: nextSpanText});
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

//                 let exchange = this.getExchange();
//                 exchange.setGames({
//                     games: game,
//                 });
//                 exchange.setCurrentOdds({
//                     currentOdds: game.getOdds({
//                         exchanges: exchange,
//                     }) as Array<Odds>,
//                 });

//             } else {
//                 console.log(`${spanText} span already recorded.`)
//             }

//         } else {
//             // console.log(`${spanText} != ${fullName} or ${abbrName}`);
//         }
//     }
// }
