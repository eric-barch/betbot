"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddSet = void 0;
const continuousOdd_1 = require("./continuousOdd");
const discreteOdd_1 = require("./discreteOdd");
class OddSet extends Set {
    async findOrCreate({ exchange, statistic, inequality, value, updateOddElementsFunction, }) {
        let requestedOdd = null;
        for (const odd of this) {
            if (odd instanceof continuousOdd_1.ContinuousOdd) {
                if (odd.matches({
                    exchange: exchange,
                    statistic: statistic,
                    inequality: inequality,
                })) {
                    return odd;
                }
            }
            else if (odd instanceof discreteOdd_1.DiscreteOdd) {
                if (odd.matches({
                    exchange: exchange,
                    statistic: statistic,
                    value: value,
                })) {
                    return odd;
                }
            }
        }
        if (inequality) {
            const newContinuousOdd = await continuousOdd_1.ContinuousOdd.create({
                exchange: exchange,
                statistic: statistic,
                inequality: inequality,
                updateOddElementsFunction: updateOddElementsFunction,
            });
            this.add(newContinuousOdd);
            return newContinuousOdd;
        }
        else if (value) {
            const newDiscreteOdd = await discreteOdd_1.DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                value: value,
                updateOddElementsFunction: updateOddElementsFunction,
            });
            this.add(newDiscreteOdd);
            return newDiscreteOdd;
        }
        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }
    async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}
exports.OddSet = OddSet;
//# sourceMappingURL=oddSet.js.map