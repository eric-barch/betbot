import * as localModels from '../..';

import { Outcome } from './outcome';

export class OutcomeSet extends Set<Outcome> {
    public find({
        game,
        type,
        oppositeOutcome,
    }: {
        game: localModels.Game,
        type: localModels.OutcomeType,
        oppositeOutcome?: Outcome,
    }): Outcome | null {
        for (const outcome of this) {
            if (outcome.matches({
                game: game,
                type: type,
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
        type,
        oppositeOutcome,
    }: {
        game: localModels.Game,
        type: localModels.OutcomeType,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        const foundOutcome = this.find({
            game: game,
            type: type,
            oppositeOutcome: oppositeOutcome,
        })

        if (foundOutcome) {
            return foundOutcome;
        }

        const newOutcome = await Outcome.create({
            game: game,
            type: type,
            oppositeOutcome: oppositeOutcome,
        });

        return newOutcome;
    }
}