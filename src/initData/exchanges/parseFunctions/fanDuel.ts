import * as chrono from 'chrono-node';
import * as puppeteer from 'puppeteer';
import { ElementHandle } from 'puppeteer';

import * as models from '../../../models';
import * as state from '../../../state';

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

export async function parseFanDuel(this: models.ExchangePageParser) {
    const page = this.getPage()!;

    const gamesFromJson = await getGamesFromJson(page); // Returns an array of Game objects based on the JSON from the website.
    const gamesFromJsonWithBaseHandles = await addBaseHandles(gamesFromJson, page); // Returns an array of ElementHandle objects for the Away Team element of every game in the visible HTML document.
    const gamesFromDocument = await getGamesFromDocument(gamesFromJsonWithBaseHandles); // Returns an array of Game objects based on visible HTML document.

    return gamesFromDocument;
}

async function getGamesFromJson(page: puppeteer.Page) {
    const jsonGamesScriptTag = await page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);

    let currentExchangeGames = new Array<models.Game>;
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
        })

        currentExchangeGames.push(currentExchangeGame);
    }

    return currentExchangeGames;
}

async function addBaseHandles(gamesFromJson: Array<models.Game>, page: puppeteer.Page) {
    for (const gameFromJson of gamesFromJson) {
        const jsonGameAwayTeam = gameFromJson.getAwayTeam();
        const jsonGameHomeTeam = gameFromJson.getHomeTeam();
        const jsonGameStartDate = gameFromJson.getStartDate();

        const possibleAwayTeamHandles = await page.$x(`//span[text()='${jsonGameAwayTeam.getFullName()}' or text()='${jsonGameAwayTeam.getRegionAbbrIdentifierFull()}']`);

        if (possibleAwayTeamHandles.length < 1) {
            console.log(`Did not find span with text ${jsonGameAwayTeam.getFullName()}.`);
        } else {
            for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
                const possibleGameBaseHandle = (await possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
                
                const expectedHomeTeamHandle = (await possibleGameBaseHandle.$$('xpath/' + homeTeamXPath))[0];
                if (expectedHomeTeamHandle instanceof ElementHandle) {
                    let expectedHomeTeamHandleTextContent;
                    try {
                        expectedHomeTeamHandleTextContent = await expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
                    } catch (error) {
                        console.log(error);
                    }

                    if (typeof expectedHomeTeamHandleTextContent === 'string') {
                        if (jsonGameHomeTeam.match({string: expectedHomeTeamHandleTextContent})) {
                            const expectedStartDateHandle = (await possibleGameBaseHandle.$$('xpath/' + startDateXPath))[0];

                            if (expectedStartDateHandle !== undefined) {
                                const expectedStartDateHandleTextContent = await expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());
                                
                                if (typeof expectedStartDateHandleTextContent === 'string') {
                                    const expectedTimeHandleStartDate = chrono.parseDate(expectedStartDateHandleTextContent);

                                    const diff = Math.abs(expectedTimeHandleStartDate.getTime() - jsonGameStartDate.getTime());
                                    const isWithin5Minutes = diff <= 300000;
    
                                    if (isWithin5Minutes) {
                                        gameFromJson.setBaseHandle({baseHandle: possibleGameBaseHandle});
                                        break;
                                    }
                                }
                            } else {
                                const currentTime = new Date();
                                
                                const diff = currentTime.getTime() - jsonGameStartDate.getTime();
                                const isWithin8HoursBefore = diff <= 28800000;

                                if (isWithin8HoursBefore) {
                                    gameFromJson.setBaseHandle({baseHandle: possibleGameBaseHandle});
                                    break;
                                }
                            }
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }

    return gamesFromJson;
}

async function getGamesFromDocument(gamesFromJsonWithBaseHandles: Array<models.Game>) {
    let gamesFromDocument: Array<models.Game> = [];

    for (const gameFromJson of gamesFromJsonWithBaseHandles) {
        const baseHandle = gameFromJson.getBaseHandle();
        if (baseHandle !== undefined) {
            // let className = await baseHandle.evaluate((node) => {
            //     return node.getAttribute('class');
            // });

            const awaySpreadHandle = (await baseHandle.$$('xpath/' + awaySpreadXPath))[0];
            const awaySpreadTextContent = await awaySpreadHandle.getProperty('textContent').then(property => property.jsonValue());

            const awaySpreadPriceHandle = (await baseHandle.$$('xpath/' + awaySpreadPriceXPath))[0];
            const awaySpreadPriceTextContent = await awaySpreadPriceHandle.getProperty('textContent').then(property => property.jsonValue());

            const homeSpreadHandle = (await baseHandle.$$('xpath/' + homeSpreadXPath))[0];
            const homeSpreadTextContent = await homeSpreadHandle.getProperty('textContent').then(property => property.jsonValue());

            const homeSpreadPriceHandle = (await baseHandle.$$('xpath/' + homeSpreadPriceXPath))[0];
            const homeSpreadPriceTextContent = await homeSpreadPriceHandle.getProperty('textContent').then(property => property.jsonValue());

            const awayMoneyPriceHandle = (await baseHandle.$$('xpath/' + awayMoneyPriceXPath))[0];
            const awayMoneyPriceTextContent = await awayMoneyPriceHandle.getProperty('textContent').then(property => property.jsonValue());

            const homeMoneyPriceHandle = (await baseHandle.$$('xpath/' + homeMoneyPriceXPath))[0];
            const homeMoneyPriceTextContent = await homeMoneyPriceHandle.getProperty('textContent').then(property => property.jsonValue());

            const overUnderHandle = (await baseHandle.$$('xpath/' + overUnderXPath))[0];
            const overUnderTextContent = await overUnderHandle.getProperty('textContent').then(property => property.jsonValue());

            const overPriceHandle = (await baseHandle.$$('xpath/' + overPriceXPath))[0];
            const overPriceTextContent = await overPriceHandle.getProperty('textContent').then(property => property.jsonValue());
            
            const underPriceHandle = (await baseHandle.$$('xpath/' + underPriceXPath))[0];
            const underPriceTextContent = await underPriceHandle.getProperty('textContent').then(property => property.jsonValue());

            const odds = gameFromJson.getOdds();
            if (odds instanceof models.Odds) {
                const spreadOdds = odds.getSpreadOdds();
                const moneyOdds = odds.getMoneyOdds();
                const overUnderOdds = odds.getOverUnderOdds();

                spreadOdds.setAwaySpread({awaySpread: awaySpreadTextContent!});
                spreadOdds.setAwayPrice({awayPrice: awaySpreadPriceTextContent!});
                spreadOdds.setHomeSpread({homeSpread: homeSpreadTextContent!});
                spreadOdds.setHomePrice({homePrice: homeSpreadPriceTextContent!});

                moneyOdds.setAwayPrice({awayPrice: awayMoneyPriceTextContent!});
                moneyOdds.setHomePrice({homePrice: homeMoneyPriceTextContent!});

                overUnderOdds.setOverUnder({overUnder: overUnderTextContent!.substring(2)});
                overUnderOdds.setOverPrice({overPrice: overPriceTextContent!});
                overUnderOdds.setUnderPrice({underPrice: underPriceTextContent!});
            } else {
                throw new Error('Expected single instance of Odds.');
            }

            gamesFromDocument.push(gameFromJson);
        }
    }

    return gamesFromDocument;
}