import * as localModels from '../..';

import { Outcome } from './outcome';

export class OutcomeSet extends Set<Outcome> {
    public find({
        game,
        name,
        oppositeOutcome,
    }: {
        game: localModels.Game,
        name: string,
        oppositeOutcome?: Outcome,
    }): Outcome | null {
        for (const outcome of this) {
            if (outcome.matches({
                game: game,
                name: name,
            })) {
                if (oppositeOutcome) {
                    outcome.oppositeOutcome = oppositeOutcome;
                }

                return outcome;
            }
        }

        return null;
    }

    public async findOrCreate({
        game,
        name,
        team,
        oppositeOutcome,
    }: {
        game: localModels.Game,
        name: string,
        team: localModels.Team,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        const foundOutcome = this.find({
            game: game,
            name: name,
            oppositeOutcome: oppositeOutcome,
        })

        if (foundOutcome) {
            return foundOutcome;
        }

        const newOutcome = await Outcome.create({
            game: game,
            name: name,
            team: team,
            oppositeOutcome: oppositeOutcome,
        });

        return newOutcome;
    }
}