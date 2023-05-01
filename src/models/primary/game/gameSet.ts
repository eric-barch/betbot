import * as models from '../..';

import { Game } from './game';

export class GameSet extends Set<Game> {
    public find({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
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
        awayTeam: models.Team,
        homeTeam: models.Team,
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
            throw new Error(`Did not find game and startDate was not provided to create new one.`);
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