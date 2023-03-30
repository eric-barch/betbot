import * as chrono from 'chrono-node';
import * as puppeteer from 'puppeteer';

import * as global from '../../../global';
import * as models from '../../../models';

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

export async function parseFanDuel(this: models.Exchange) {
    const gamesFromJson = await getGameInstancesFromJson({ exchange: this });
    const oddsFromDocument = await getOddsInstancesFromDocument({exchange: this, gamesFromJson: gamesFromJson});

    return oddsFromDocument;
}

async function getGameInstancesFromJson({ 
    exchange,
}: {
    exchange: models.Exchange,
}) {
    let gameInstances = new models.GameSet;

    // Rewrite this in a more readable way.
    const jsonGamesScriptTag = await exchange.getPage().$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await exchange.getPage().evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);
    
    for (const jsonGame of jsonGames) {
        const awayTeamNameString = jsonGame.awayTeam.name;
        const homeTeamNameString = jsonGame.homeTeam.name;

        const awayTeamInstance = global.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
        const homeTeamInstance = global.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
        const startDate = new Date(jsonGame.startDate);

        const correspondingGameInstance = global.allGames.getGameByTeamsAndStartDate({
            awayTeam: awayTeamInstance,
            homeTeam: homeTeamInstance,
            startDate: startDate,
            exchange: exchange,
        });

        gameInstances.add(correspondingGameInstance);
    }

    return gameInstances;
}

async function getOddsInstancesFromDocument({
    exchange,
    gamesFromJson,
}: {
    exchange: models.Exchange,
    gamesFromJson: models.GameSet;
}) {
    let oddsFromDocument = new models.OddsSet;

    for (const gameFromJson of gamesFromJson) {
        const baseHandle = await getBaseHandle({
            exchange: exchange,
            game: gameFromJson,
        })

        if (baseHandle === null) {
            console.log(`${gameFromJson.getName()} exists in the JSON games for ${exchange.getName()} but not in the visible document.`);
        } else {
            const odds = gameFromJson.getOddsByExchange({ exchange: exchange });
            odds.setBaseHandle({ baseHandle: baseHandle });
            
            const awaySpread = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: awaySpreadXPath, odds: odds }) });
            const awaySpreadPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: awaySpreadPriceXPath, odds: odds }) });
            const homeSpread = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: homeSpreadXPath, odds: odds }) });
            const homeSpreadPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: homeSpreadPriceXPath, odds: odds }) });
    
            const awayMoneyPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: awayMoneyPriceXPath, odds: odds }) });
            const homeMoneyPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: homeMoneyPriceXPath, odds: odds }) });
    
            const overUnder = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: overUnderXPath, odds: odds }) });
            const overPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: overPriceXPath, odds: odds }) });
            const underPrice = await getElementNumericalValue({ elementHandle: await getElementHandleByXPath({ xPath: underPriceXPath, odds: odds }) });
    
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

            oddsFromDocument.add(odds);
        }
    }

    return oddsFromDocument;
}

async function getBaseHandle({
    exchange,
    game
}: {
    exchange: models.Exchange,
    game: models.Game,
}): Promise<puppeteer.ElementHandle | null> {
    let baseHandle;

    const possibleAwayTeamHandles = await exchange.getPage().$x(`//span[text()='${game.getAwayTeam().getRegionFullIdentifierFull()}' or text()='${game.getAwayTeam().getRegionAbbrIdentifierFull()}']`);

    for (const possibleAwayTeamHandle of possibleAwayTeamHandles) {
        const expectedBaseHandle = (await possibleAwayTeamHandle.$$('xpath/' + awayTeamToBaseXPath))[0];
        const expectedHomeTeamHandle = (await expectedBaseHandle.$$('xpath/' + homeTeamXPath))[0];
        const expectedStartDateHandle = (await expectedBaseHandle.$$('xpath/' + startDateXPath))[0];

        const awayTeamNameString = await getElementTextValue({ elementHandle: possibleAwayTeamHandle });
        const homeTeamNameString = await getElementTextValue({ elementHandle: expectedHomeTeamHandle });
        const startDateString = await getElementTextValue({ elementHandle: expectedStartDateHandle });

        const awayTeam = game.getAwayTeam();
        const homeTeam = game.getHomeTeam();
        const startDate = game.getStartDate();

        const awayTeamMatches = (typeof awayTeamNameString === 'string' && awayTeam.matchesByNameString({ nameString: awayTeamNameString }));
        const homeTeamMatches = (typeof homeTeamNameString === 'string' && homeTeam.matchesByNameString({ nameString: homeTeamNameString }));
        
        const startDateMatch = (documentStartDate: string | null, localStartDate: Date) => {
            if (typeof documentStartDate === 'string') {
                documentStartDate = documentStartDate.slice(0, -3);
                const startDateParsed = chrono.parseDate(documentStartDate);
                const startDateParsedRounded = models.Game.roundToNearestInterval(startDateParsed);

                if (startDateParsedRounded.getTime() === localStartDate.getTime()) {
                    return true;
                }
            }

            return false;
        }
        const startDateMatches = startDateMatch(startDateString, startDate);

        if (awayTeamMatches && homeTeamMatches && startDateMatches) {
            baseHandle = expectedBaseHandle;
            return baseHandle;
        }
    }

    return null;
}

async function getElementHandleByXPath({
    xPath,
    odds,
}: {
    xPath: string,
    odds: models.Odds,
}): Promise<puppeteer.ElementHandle> {
    const baseHandle = odds.getBaseHandle();
    const elementHandle = (await baseHandle.$$('xpath/' + xPath))[0];
    return elementHandle;
}

async function getElementTextValue({
    elementHandle,
}: {
    elementHandle: puppeteer.ElementHandle<Node>,
}): Promise<string | null> {
    try {
        const elementTextContent = await elementHandle.getProperty('textContent').then(property => property.jsonValue());       
        return elementTextContent;
    } catch {
        // console.log('Could not find element text value.');
    }

    return null;
}

async function getElementNumericalValue({
    elementHandle,
}: {
    elementHandle: puppeteer.ElementHandle,
}): Promise<number | null> {
    try {
        const elementTextContent = await elementHandle.getProperty('textContent').then(property => property.jsonValue());
        const numericTextContent = elementTextContent!.replace(/[^\d.-]/g, '');
        const elementValue = Number(numericTextContent);
        
        if (elementValue) {
            return elementValue;
        }
    } catch {
        // console.log('Could not find element numerical value.');
    }

    return null;
}