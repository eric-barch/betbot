import { Odd } from "./odd";

import * as localModels from '../../../local';

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }): Promise<Odd> {
        let requestedOdd = null;

        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                statistic: statistic,
            })) {
                requestedOdd = odd;
            }
        }

        if (!requestedOdd) {
            requestedOdd = await Odd.create({
                exchange: exchange,
                statistic: statistic,
            })

            this.add(requestedOdd);
        }

        return requestedOdd;
    }
}