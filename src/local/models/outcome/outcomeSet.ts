import * as localModels from '../..';

import { Outcome } from './outcome';

export class OutcomeSet extends Set<Outcome> {
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

        const newOutcome = await Outcome.create({
            game: game,
            name: name,
            team: team,
            oppositeOutcome: oppositeOutcome,
        });

        return newOutcome;
    }
}