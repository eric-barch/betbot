"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlScrape = void 0;
class HtmlScrape {
    constructor({ string, scrapedAt, }) {
        this.string = string;
        scrapedAt ? this.scrapedAt = scrapedAt : this.scrapedAt = new Date();
    }
    // Public methods
    // Getters
    getString() {
        return this.string;
    }
    getScrapedAt() {
        return this.scrapedAt;
    }
}
exports.HtmlScrape = HtmlScrape;
//# sourceMappingURL=htmlScrape.js.map