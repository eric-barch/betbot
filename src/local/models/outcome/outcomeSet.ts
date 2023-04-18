import * as localModels from '../..';

import { Outcome } from './outcome';

export class OutcomeSet extends Set<Outcome> {
    public async findOrCreate({
        game,
        name,
    }: {
        game: localModels.Game,
        name: string,
    }): Promise<Outcome> {
        for (const outcome of this) {
            if (outcome.matches({
                game: game,
                name: name,
            })) {
                return outcome;
            }
        }

        const newOutcome = await Outcome.create({
            game: game,
            name: name,
        });

        return newOutcome;
    }
}