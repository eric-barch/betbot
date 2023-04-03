import * as puppeteer from 'puppeteer';

import * as globalModels from '../../../../global/models';
import * as localModels from '../../../../local/models';

export async function parseFanDuel(this: localModels.Exchange) {
    const localGamesFromJson = await getlocalGamesFromJson({ exchange: this });
    const localOddsFromDocument = await getLocalOddsFromDocument({exchange: this, gamesFromJson: localGamesFromJson});

    return localOddsFromDocument;
}

async function getlocalGamesFromJson({ 
    exchange,
}: {
    exchange: localModels.Exchange,
}) {
    let games = new localModels.GameSet;

    // Rewrite this in a more readable way.
    const jsonGamesScriptTag = await exchange.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await exchange.page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);
    //
    
    for (const jsonGame of jsonGames) {
        const awayTeamNameString = jsonGame.awayTeam.name;
        const homeTeamNameString = jsonGame.homeTeam.name;

        const awayTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
        const homeTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
        const startDate = new Date(jsonGame.startDate);

        const correspondingGameInstance = await globalModels.allGames.getGameByTeamsAndStartDate({
            awayTeam: awayTeamInstance,
            homeTeam: homeTeamInstance,
            startDate: startDate,
            exchange: exchange,
        });

        games.add(correspondingGameInstance);
    }

    return games;
}

async function getLocalOddsFromDocument({
    exchange,
    gamesFromJson,
}: {
    exchange: localModels.Exchange,
    gamesFromJson: localModels.GameSet,
}) {
    let oddsFromDocument = new localModels.OddSet;

    const page = exchange.page;

    for (const game of gamesFromJson) {
        const gameName = game.regionFullIdentifierFull;
        const gameTitleElements = await page.$$(`[title="${gameName}"]`);

        if (gameTitleElements.length === 0) {
            console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
            continue;
        }else if (gameTitleElements.length > 2) {
            throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
        }

        const gameElement = await gameTitleElements[0].getProperty('parentElement');

        const odd = await game.getOddByExchange({ exchange: exchange });
        
        if (gameElement instanceof puppeteer.ElementHandle) {
            const awaySpreadElements = await getComponentElements({
                selector: `[aria-label*="${game.awayTeam.name}"][aria-label*="Spread Betting"]`,
                gameElement: gameElement,
            });

            const awayMoneyElements = await getComponentElements({
                selector: `[aria-label*="${game.awayTeam.name}"][aria-label*="Moneyline"]`,
                gameElement: gameElement,
            });

            const overTotalElements = await getComponentElements({
                selector: `[aria-label*="${game.awayTeam.name}"][aria-label*="Total Points"]`,
                gameElement: gameElement,
            });

            const homeSpreadElements = await getComponentElements({
                selector: `[aria-label*="${game.homeTeam.name}"][aria-label*="Spread Betting"]`,
                gameElement: gameElement,
            });

            const homeMoneyElements = await getComponentElements({
                selector: `[aria-label*="${game.homeTeam.name}"][aria-label*="Moneyline"]`,
                gameElement: gameElement,
            });

            const underTotalElements = await getComponentElements({
                selector: `[aria-label*="${game.homeTeam.name}"][aria-label*="Total Points"]`,
                gameElement: gameElement,
            });

            odd.spreadOdd.awaySpread.element = awaySpreadElements[0];
            odd.spreadOdd.awayPrice.element = awaySpreadElements[1];
            odd.spreadOdd.homeSpread.element = homeSpreadElements[0];
            odd.spreadOdd.homePrice.element = homeSpreadElements[1];

            odd.moneyOdd.awayPrice.element = awayMoneyElements[0];
            odd.moneyOdd.homePrice.element = homeMoneyElements[0];

            odd.totalOdd.overTotal.element = overTotalElements[0];
            odd.totalOdd.overPrice.element = overTotalElements[1];
            odd.totalOdd.underTotal.element = underTotalElements[0];
            odd.totalOdd.underPrice.element = underTotalElements[1];

            console.log('foo');
        }
    }
}

async function getComponentElements({
    selector,
    gameElement,
}: {
    selector: string,
    gameElement: puppeteer.ElementHandle,
}): Promise<puppeteer.ElementHandle[]> {
    const parentElement = await gameElement.$(selector);
    const parentElementChildren = await parentElement?.$$('span');
    
    if (parentElementChildren) {
        return parentElementChildren;
    } else {
        throw new Error(`parentElementChildren is undefined.`);
    }
}