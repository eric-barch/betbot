import * as chrono from 'chrono-node';
import * as puppeteer from 'puppeteer';

import * as models from '../../../../models';

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

let exchange: models.Exchange;
let page: puppeteer.Page;
let gamesFromJson: models.GameSet;
let oddsFromDocument: models.OddsSet;

export async function parseFanDuel(this: models.Exchange) {
    exchange = this;
    page = this.getPage()!;

    gamesFromJson = await getGamesFromJson(); 
    /**Returns a GameSet based on the JSON from the website. 
     * If the Game already exists in AllGames, it pulls that game. If it 
     * doesn't, it creates a new game in AllGames and adds the reference
     * to the set. */
    
    oddsFromDocument = await getOddsFromDocument();
    /**Returns a set of odds for the games visibly listed on the actual
     * FanDuel page. It uses the JsonGames set as a starting point for 
     * which games it should search for in the visible document. If the
     * Odds already exist in AllOdds and the OddsSets for the relevant 
     * game and exchange, it pulls that Odds instance and adds it to the
     * return set. If not, it creates the Odds instance and adds it to 
     * all three sets and the return set. */

    return oddsFromDocument;
}

async function getGamesFromJson() {
    let gamesFromJson = new models.GameSet;

    const jsonGamesScriptTag = await page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);

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
        })

        gamesFromJson.add(requestedGame); 
    }

    return gamesFromJson;
}

async function getOddsFromDocument() {
    let oddsFromDocument = new models.OddsSet;

    for (const gameFromJson of gamesFromJson) {
        let exchangeGameBaseHandle;
        const possibleAwayTeamHandles = await page.$x(`//span[text()='${gameFromJson.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${gameFromJson.getAwayTeam().getRegionAbbrIdentifierFull()}']`);
        
        if (possibleAwayTeamHandles.length < 1) {
            console.log(`Did not find span with text ${gameFromJson.getAwayTeam().getRegionFullIdentifierFull()}.`);
        } else {
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
}

async function getExchangeGameBaseHandle(
    possibleAwayTeamHandles: puppeteer.ElementHandle<Node>[],
    gameFromJson: models.Game
): Promise<puppeteer.ElementHandle | null> {
    let exchangeGameBaseHandle;

    for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
        const expectedExchangeGameBaseHandle = (await possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
        const expectedHomeTeamHandle = (await expectedExchangeGameBaseHandle.$$('xpath/' + homeTeamXPath))[0];
        const expectedStartDateHandle = (await expectedExchangeGameBaseHandle.$$('xpath/' + startDateXPath))[0];

        if (! await homeTeamMatches(expectedHomeTeamHandle, gameFromJson)) {
            break;
        }

        if (! await startDateMatches(expectedStartDateHandle, gameFromJson)) {
            break;
        }

        exchangeGameBaseHandle = expectedExchangeGameBaseHandle;
        return exchangeGameBaseHandle;
    }

    return null;
}

async function homeTeamMatches(
    expectedHomeTeamHandle: puppeteer.ElementHandle,
    gameFromJson: models.Game,
): Promise<boolean> {
    try {
        const textContent = await expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
        
        if (typeof textContent === 'string' &&
            gameFromJson.getHomeTeam().matchesByNameString({string: textContent})) {
            return true;
        }
    } catch (error) {
        console.log(error);
    }

    return false;
}

async function startDateMatches(
    expectedStartDateHandle: puppeteer.ElementHandle,
    gameFromJson: models.Game,
): Promise<boolean> {

    if (expectedStartDateHandle !== undefined) {
        const expectedStartDateHandleTextContent = await expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());
        
        if (typeof expectedStartDateHandleTextContent === 'string') {
            const expectedTimeHandleStartDate = chrono.parseDate(expectedStartDateHandleTextContent);

            const diff = Math.abs(expectedTimeHandleStartDate.getTime() - gameFromJson.getStartDate().getTime());
            const isWithin5Minutes = diff <= 300000;

            if (isWithin5Minutes) {
                return true;
            }
        }
    } else {
        const currentTime = new Date();
        
        const diff = currentTime.getTime() - gameFromJson.getStartDate().getTime();
        const isWithin8HoursBefore = diff <= 28800000;

        if (isWithin8HoursBefore) {
            return true;
        }
    }

    return false;
}

async function getOddsElementContent(gameBaseHandle: puppeteer.ElementHandle, xPath: string) {
    const oddsElementHandle = (await gameBaseHandle.$$('xpath/' + xPath))[0];
    let oddsElementContent;

    try {
        oddsElementContent = await oddsElementHandle.getProperty('textContent').then(property => property.jsonValue());
    } catch {
        oddsElementContent = '0';
    }

    return oddsElementContent;
}