"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddSet = void 0;
const continuousOdd_1 = require("./continuousOdd");
const discreteOdd_1 = require("./discreteOdd");
class OddSet extends Set {
    async findOrCreate({ exchange, statistic, inequality, value, updateElementsFunction, }) {
        for (const odd of this) {
            if (odd.exchange === exchange && odd.statistic === statistic) {
                if (odd instanceof continuousOdd_1.ContinuousOdd && inequality !== undefined) {
                    if (await odd.getInequality() === inequality) {
                        return odd;
                    }
                }
                else if (odd instanceof discreteOdd_1.DiscreteOdd && value !== undefined) {
                    if (await odd.getValue() === value) {
                        return odd;
                    }
                }
            }
        }
        if (inequality) {
            const newContinuousOdd = await continuousOdd_1.ContinuousOdd.create({
                exchange: exchange,
                statistic: statistic,
                inequality: inequality,
                updateElementsFunction: updateElementsFunction,
            });
            newContinuousOdd.setInequality(inequality);
            this.add(newContinuousOdd);
            return newContinuousOdd;
        }
        else if (value !== undefined) {
            const newDiscreteOdd = await discreteOdd_1.DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                value: value,
                updateElementsFunction: updateElementsFunction,
            });
            await newDiscreteOdd.setValue(value);
            this.add(newDiscreteOdd);
            return newDiscreteOdd;
        }
        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }
}
exports.OddSet = OddSet;
//# sourceMappingURL=oddSet.js.map