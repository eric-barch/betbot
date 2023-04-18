import * as globalModels from '../../global';
import * as localModels from '../../local';
import * as updateFunctions from '..';

export async function fanDuel(this: localModels.Exchange): Promise<localModels.ExchangeGameSet> {
    const page = this.page;

    const jsonGamesScriptElement = await page.$('script[type="application/ld+json"][data-react-helmet="true"]');

    if (!jsonGamesScriptElement) {
        throw new Error(`Did not find jsonGamesScriptElement for FanDuel.`);
    }

    const textContent = await (await jsonGamesScriptElement.getProperty('textContent')).jsonValue();

    if (!textContent) {
        throw new Error(`Found no text in FanDuel jsonGamesScriptElement.`);
    }

    const jsonGames = JSON.parse(textContent);

    for (const jsonGame of jsonGames) {
        const awayTeamName = jsonGame.awayTeam.name;
        const homeTeamName = jsonGame.homeTeam.name;

        const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
        const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
        const startDate = new Date(jsonGame.startDate);

        const requestedGame = await globalModels.allGames.findOrCreate({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });

        await this.exchangeGames.findOrCreate({
            exchange: this,
            game: requestedGame,
            updateElementFunction: updateFunctions.exchangeGameElement.fanDuel,
        });
    }

    return this.exchangeGames;
}