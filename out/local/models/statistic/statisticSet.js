"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticSet = void 0;
const statistic_1 = require("./statistic");
class StatisticSet extends Set {
    async findOrCreate({ game, name, }) {
        let requestedStatistic = null;
        for (const statistic of this) {
            if (statistic.matches({
                game: game,
                name: name,
            })) {
                requestedStatistic = statistic;
                break;
            }
        }
        if (!requestedStatistic) {
            requestedStatistic = await statistic_1.Statistic.create({
                game: game,
                name: name,
            });
            this.add(requestedStatistic);
        }
        return requestedStatistic;
    }
}
exports.StatisticSet = StatisticSet;
//# sourceMappingURL=statisticSet.js.map