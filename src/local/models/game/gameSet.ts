import * as localModels from '../../../local/models';

export class GameSet extends Set<localModels.Game> {
    public async findOrCreate({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): Promise<localModels.Game> {
        let requestedGame = undefined;
        
        for (const game of this) {
            if (game.matches({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                requestedGame = game;
                break;
            }
        }

        if (!requestedGame) {
            requestedGame = await localModels.Game.create({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            
            this.add(requestedGame);
        }

        return requestedGame;
    }
}