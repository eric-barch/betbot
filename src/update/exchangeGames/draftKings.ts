import * as globalModels from '../../global';
import * as localModels from '../../local';
import * as updateFunctions from '..';

export async function draftKings(this: localModels.Exchange): Promise<localModels.ExchangeGameSet> {
    const page = this.page;
    const gameScriptElements = await page.$$('script[type="application/ld+json"]');

    const jsonGames: Record<string,any>[] = [];

    for (const gameScriptElement of gameScriptElements) {
        const content = await gameScriptElement.getProperty('textContent');
        const textContent = await content.jsonValue();

        if (textContent) {
            jsonGames.push(JSON.parse(textContent));
        }
    }
    
    for (const jsonGame of jsonGames) {
        const awayTeamNameString = jsonGame.awayTeam.name;
        const homeTeamNameString = jsonGame.homeTeam.name;

        const awayTeamInstance = globalModels.allTeams.find({ name: awayTeamNameString });
        const homeTeamInstance = globalModels.allTeams.find({ name: homeTeamNameString });
        const startDate = new Date(jsonGame.startDate);

        const requestedGame = await globalModels.allGames.findOrCreate({
            awayTeam: awayTeamInstance,
            homeTeam: homeTeamInstance,
            startDate: startDate,
        });

        await this.exchangeGames.findOrCreate({
            exchange: this,
            game: requestedGame,
            updateElementFunction: updateFunctions.exchangeGameElement.draftKings,
        });
    }

    return this.exchangeGames;
}