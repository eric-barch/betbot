import * as localModels from '../../../local';

import { Game } from './game';

export class GameSet extends Set<Game> {
    public async findOrCreate({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): Promise<Game> {         
        for (const game of this) {
            if (game.matches({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                return game;
            }
        }

        const newGame = await Game.create({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });
        
        this.add(newGame);

        return newGame;
    }
}