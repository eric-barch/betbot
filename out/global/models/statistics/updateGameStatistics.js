"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameStatisticsFunction = void 0;
async function updateGameStatisticsFunction() {
    const spreadAway = await this.statisticSet.findOrCreate({
        game: this,
        name: 'spread_away',
    });
    this.statisticSet.add(spreadAway);
    const spreadHome = await this.statisticSet.findOrCreate({
        game: this,
        name: 'spread_home',
    });
    this.statisticSet.add(spreadHome);
    const moneyline = await this.statisticSet.findOrCreate({
        game: this,
        name: 'moneyline',
    });
    this.statisticSet.add(moneyline);
    const total = await this.statisticSet.findOrCreate({
        game: this,
        name: 'total',
    });
    this.statisticSet.add(total);
    return this.statisticSet;
}
exports.updateGameStatisticsFunction = updateGameStatisticsFunction;
//# sourceMappingURL=updateGameStatistics.js.map