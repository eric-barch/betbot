import * as globalModels from '../../../../../global';
import * as localModels from '../../../../../local';

export async function updateGames(this: localModels.Exchange): Promise<localModels.GameSet> {
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