"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadOdds = void 0;
class SpreadOdds {
    constructor({ verbose = false, } = {}) {
        this.awaySpread = 0;
        this.awayPrice = 0;
        this.homeSpread = 0;
        this.homePrice = 0;
    }
    getAwaySpread({ verbose = false, } = {}) {
        return this.awaySpread;
    }
    getAwayPrice({ verbose = false, } = {}) {
        return this.awayPrice;
    }
    getHomeSpread({ verbose = false, } = {}) {
        return this.homeSpread;
    }
    getHomePrice({ verbose = false, } = {}) {
        return this.homePrice;
    }
    setAwaySpread({ awaySpread, verbose = false, }) {
        if (typeof awaySpread === 'number') {
            this.awaySpread = awaySpread;
        }
        else if (typeof awaySpread === 'string') {
            this.awaySpread = Number(awaySpread);
        }
        verbose ? console.log(`\tspreadOdds.awaySpread set to ${this.getAwaySpread()}`) : null;
    }
    setAwayPrice({ awayPrice, verbose = false, }) {
        if (typeof awayPrice === 'number') {
            this.awayPrice = awayPrice;
        }
        else if (typeof awayPrice === 'string') {
            this.awayPrice = Number(awayPrice);
        }
        verbose ? console.log(`\tspreadOdds.awayPrice set to ${this.getAwayPrice()}`) : null;
    }
    setHomeSpread({ homeSpread, verbose = false, }) {
        this.homeSpread = homeSpread;
    }
    setHomePrice({ homePrice, verbose = false, }) {
        this.homePrice = homePrice;
    }
}
exports.SpreadOdds = SpreadOdds;
