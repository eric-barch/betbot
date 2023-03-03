"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadOdds = void 0;
class SpreadOdds {
    constructor() {
        this.awaySpread = 0;
        this.awayPrice = 0;
        this.homeSpread = 0;
        this.homePrice = 0;
    }
    getAwaySpread() {
        return this.awaySpread;
    }
    getAwayPrice() {
        return this.awayPrice;
    }
    getHomeSpread() {
        return this.homeSpread;
    }
    getHomePrice() {
        return this.homePrice;
    }
    setAwaySpread({ awaySpread, }) {
        if (typeof awaySpread === 'number') {
            this.awaySpread = awaySpread;
        }
        else if (typeof awaySpread === 'string') {
            this.awaySpread = Number(awaySpread);
        }
    }
    setAwayPrice({ awayPrice, }) {
        if (typeof awayPrice === 'number') {
            this.awayPrice = awayPrice;
        }
        else if (typeof awayPrice === 'string') {
            this.awayPrice = Number(awayPrice);
        }
    }
    setHomeSpread({ homeSpread, }) {
        this.homeSpread = homeSpread;
    }
    setHomePrice({ homePrice, }) {
        this.homePrice = homePrice;
    }
}
exports.SpreadOdds = SpreadOdds;
//# sourceMappingURL=spreadOdds.js.map