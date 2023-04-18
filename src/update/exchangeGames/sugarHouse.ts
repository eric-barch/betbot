import * as chrono from 'chrono-node';

import * as globalModels from '../../global';
import * as localModels from '../../local';
import * as updateFunctions from '..';

export async function sugarHouse(this: localModels.Exchange)/*: Promise<localModels.ExchangeGameSet> */{
    const page = this.page;

    const articleElements = await page.$$('article');

    for (const articleElement of articleElements) {
        const awayTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[1]/div/span');
        const homeTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[2]/div/span');
        const startDateElement = await articleElement.$('time');

        if (!awayTeamElement || !homeTeamElement || !startDateElement) {
            continue;
        }

        const awayTeamName = await (await awayTeamElement.getProperty('textContent')).jsonValue();
        const homeTeamName = await (await homeTeamElement.getProperty('textContent')).jsonValue();
        const startDateText = await (await startDateElement.getProperty('textContent')).jsonValue();

        if (!awayTeamName || !homeTeamName || !startDateText) {
            continue;
        }

        const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
        const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
        const startDate = chrono.parseDate(startDateText);

        const requestedGame = await globalModels.allGames.findOrCreate({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });

        await this.exchangeGames.findOrCreate({
            exchange: this,
            game: requestedGame,
            updateElementFunction: updateFunctions.exchangeGameElement.sugarHouse,
        });
    }

    return this.exchangeGames;
}