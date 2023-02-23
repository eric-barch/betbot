export class HtmlScrape {
    private string: string;
    private scrapedAt: Date;

    constructor({
        string,
        scrapedAt,
    }: {
        string: string,
        scrapedAt?: Date,
    }) {
        this.string = string;
        scrapedAt ? this.scrapedAt = scrapedAt : this.scrapedAt = new Date();
    }

    // Public methods

    
    // Getters
    public getString({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.string;
    }

    public getScrapedAt({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.scrapedAt;
    }

}
console.log(`Initialized and imported classes.exchangePageUtilities.HtmlScrape.`);