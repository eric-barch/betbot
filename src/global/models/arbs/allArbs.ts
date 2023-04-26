import * as localModels from '../../../models';

class AllArbs extends localModels.ArbSet {
    public async update() {
        for (const arb of this) {
            await arb.update();
        }
    }
}

export const allArbs = new AllArbs();