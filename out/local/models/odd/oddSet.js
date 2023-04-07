"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddSet = void 0;
const odd_1 = require("./odd");
class OddSet extends Set {
    async findOrCreate({ exchange, statistic, }) {
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
            requestedOdd = await odd_1.Odd.create({
                exchange: exchange,
                statistic: statistic,
            });
            this.add(requestedOdd);
        }
        return requestedOdd;
    }
}
exports.OddSet = OddSet;
//# sourceMappingURL=oddSet.js.map