"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSet = void 0;
const game_1 = require("./game");
class GameSet extends Set {
    async findOrCreate({ awayTeam, homeTeam, startDate, }) {
        let requestedGame = null;
        for (const game of this) {
            if (game.matches({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                requestedGame = game;
                break;
            }
        }
        if (!requestedGame) {
            requestedGame = await game_1.Game.create({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            this.add(requestedGame);
        }
        return requestedGame;
    }
}
exports.GameSet = GameSet;
//# sourceMappingURL=gameSet.js.map