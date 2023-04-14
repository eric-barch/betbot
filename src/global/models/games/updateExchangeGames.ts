import * as globalModels from '../..';
import * as localModels from '../../../local';

export const updateExchangeGamesFunctionsMap = new Map<string, Function>([
    ['fanDuel', fanDuelUpdateGames],
    ['draftKings', draftKingsUpdateGames],
]);

async function fanDuelUpdateGames(this: localModels.Exchange): Promise<localModels.GameSet> {
    const jsonGamesScriptTag = await this.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
    const jsonGames = await this.page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);

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

        requestedGame.exchangeSet.add(this);
        this.gameSet.add(requestedGame);
    }

    return this.gameSet;
}

async function draftKingsUpdateGames(this: localModels.Exchange): Promise<localModels.GameSet> {
        const gameScriptElements = await this.page.$$('script[type="application/ld+json"]');

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
    
            requestedGame.exchangeSet.add(this);
            this.gameSet.add(requestedGame);
        }
    
        return this.gameSet;
}