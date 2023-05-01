import { Odd } from "./odd";
import * as models from '../../../models';

export class OddSet extends Set<Odd> {
    public find({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }): Odd {
        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                outcome: outcome,
            })) {
                return odd;
            }
        }

        throw new Error(`Did not find odd.`);
    }

    public async findOrCreate({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }): Promise<Odd> {
        let odd;

        try {
            odd = this.find({
                exchange: exchange,
                outcome: outcome,
            });
        } catch {
            odd = await Odd.create({
                exchange: exchange,
                outcome: outcome,
            });
        }

        this.add(odd);
        return odd;
    }

    public async getElements(): Promise<OddSet> {
        for (const odd of this) {
            await odd.getElements();
        }

        return this;
    }

    public async getValues(): Promise<OddSet> {
        for (const odd of this) {
            await odd.getValues();
        }

        return this;
    }
}