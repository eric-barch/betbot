import { Game } from './game';
import * as models from '../../../models';

export class GameSet extends Set<Game> {
    public find({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate?: Date,
    }): Game {
        for (const game of this) {
            if (game.matches({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                return game;
            }
        }

        throw new Error(`Did not find game.`);
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
        let game: Game;

        try {
            game = this.find({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
        } catch {
            if (!startDate) {
                throw new Error(`Did not find game and startDate was not provided to create new one.`);
            }

            game = await Game.create({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
        }
        
        this.add(game);
        return game;
    }
}