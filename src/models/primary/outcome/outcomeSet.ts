import { Outcome } from './outcome';
import * as models from '../../../models';

export class OutcomeSet extends Set<Outcome> {
    public find({
        game,
        type,
        oppositeOutcome,
    }: {
        game: models.Game,
        type: models.OutcomeType,
        oppositeOutcome?: Outcome,
    }): Outcome {
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

        throw new Error(`Did not find outcome.`);
    }

    public async findOrCreate({
        game,
        type,
        oppositeOutcome,
    }: {
        game: models.Game,
        type: models.OutcomeType,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        let outcome;

        try {
            outcome = this.find({
                game: game,
                type: type,
                oppositeOutcome: oppositeOutcome,
            });
        } catch {
            outcome = await Outcome.create({
                game: game,
                type: type,
                oppositeOutcome: oppositeOutcome,
            });
        }

        this.add(outcome);
        return outcome;
    }
}