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
let baseHandle: puppeteer.ElementHandle;

export async function parseFanDuel(this: models.Exchange) {
    exchange = this;
    page = this.getPage()!;

    const gamesFromJson = await getGamesFromJson();
    const oddsFromDocument = await getOddsFromDocument(gamesFromJson);

    return oddsFromDocument;
}

async function getGamesFromJson() {
    let gamesFromJson = new models.GameSet;

    const jsonGamesScriptTag = await page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);

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
        })

        gamesFromJson.add(requestedGame); 
    }

    return gamesFromJson;
}

async function getOddsFromDocument(gamesFromJson: models.GameSet) {
    let oddsFromDocument = new models.OddsSet;

    let gamesFromDocument = gamesFromJson;

    for (const game of gamesFromDocument) {
        const baseHandle = await getBaseHandle({game: game});

        if (baseHandle === null) {
            console.log(`Did not find visible document object for ${game.getAwayTeam().getRegionFullIdentifierFull()} @ ${game.getHomeTeam().getRegionFullIdentifierFull()}.`);
            gamesFromDocument.delete(game);
        } else {
            const odds = game.getOddsByExchange({
                exchange: exchange,
            });
    
            odds.setBaseHandle({
                baseHandle: baseHandle,
            });

            oddsFromDocument.add(odds)
        }
    }

    for (const odds of oddsFromDocument) {
        baseHandle = odds.getBaseHandle();

        const awaySpread = await getElementValue({ xPath: awaySpreadXPath });
        const awaySpreadPrice = await getElementValue({ xPath: awaySpreadPriceXPath });
        const homeSpread = await getElementValue({ xPath: homeSpreadPriceXPath });
        const homeSpreadPrice = await getElementValue({ xPath: homeSpreadPriceXPath });

        const awayMoneyPrice = await getElementValue({ xPath: awayMoneyPriceXPath });
        const homeMoneyPrice = await getElementValue({ xPath: homeMoneyPriceXPath });

        const overUnder = await getElementValue({ xPath: overUnderXPath });
        const overPrice = await getElementValue({ xPath: overPriceXPath });
        const underPrice = await getElementValue({ xPath: underPriceXPath });

        const spreadOdds = odds.getSpreadOdds();
        const moneyOdds = odds.getMoneyOdds();
        const overUnderOdds = odds.getOverUnderOdds();

        spreadOdds.setAwaySpread({awaySpread: awaySpread});
        spreadOdds.setAwayPrice({awayPrice: awaySpreadPrice});
        spreadOdds.setHomeSpread({homeSpread: homeSpread});
        spreadOdds.setHomePrice({homePrice: homeSpreadPrice});

        moneyOdds.setAwayPrice({awayPrice: awayMoneyPrice});
        moneyOdds.setHomePrice({homePrice: homeMoneyPrice});

        overUnderOdds.setOverUnder({overUnder: overUnder});
        overUnderOdds.setOverPrice({overPrice: overPrice});
        overUnderOdds.setUnderPrice({underPrice: underPrice});

        odds.setUpdatedAt({ updatedAt: new Date()});
    }

    return oddsFromDocument;
}

async function getBaseHandle({
    game
}: {
    game: models.Game,
}): Promise<puppeteer.ElementHandle | null> {
    let baseHandle;

    const possibleAwayTeamHandles = await page.$x(`//span[text()='${game.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${game.getAwayTeam().getRegionAbbrIdentifierFull()}']`);

    for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
        const expectedBaseHandle = (await possibleAwayTeamHandle.$$('xpath/' + '../../../../../../../..'))[0];
        const expectedHomeTeamHandle = (await expectedBaseHandle.$$('xpath/' + homeTeamXPath))[0];
        const expectedStartDateHandle = (await expectedBaseHandle.$$('xpath/' + startDateXPath))[0];

        const awayTeamText = await possibleAwayTeamHandle.getProperty('textContent').then(property => property.jsonValue());
        const homeTeamText = await expectedHomeTeamHandle.getProperty('textContent').then(property => property.jsonValue());
        let startDateText = await expectedStartDateHandle.getProperty('textContent').then(property => property.jsonValue());

        const awayTeam = game.getAwayTeam();
        let homeTeam = game.getHomeTeam();
        let startDate = game.getStartDate();

        if (typeof awayTeamText === 'string' && awayTeam.matchesByNameString({string: awayTeamText}) &&
                typeof homeTeamText === 'string' && homeTeam.matchesByNameString({string: homeTeamText}) &&
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
}

async function getElementValue({
    xPath,
}: {
    xPath: string,
}): Promise<number | null> {
    try {
        const elementHandle = (await baseHandle.$$('xpath/' + xPath))[0];
        const elementTextContent = await elementHandle.getProperty('textContent').then(property => property.jsonValue());
        const numericTextContent = elementTextContent!.replace(/[^\d.-]/g, '');
        const elementValue = Number(numericTextContent);
        
        return elementValue;
    } catch {
        console.log('Could not find element value.');
    }

    return null;
}