import * as localModels from '../../models';

import { Game } from './game';

export class GameSet extends Set<Game> {
    public find({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate?: Date,
    }): Game | null {
        for (const game of this) {
            if (game.matches({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                return game;
            }
        }

        return null;
    }

    public async findOrCreate({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate?: Date,
    }): Promise<Game | null> {         
        const foundGame = this.find({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });

        if (foundGame) {
            return foundGame;
        }

        if (!startDate) {
            return null;
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