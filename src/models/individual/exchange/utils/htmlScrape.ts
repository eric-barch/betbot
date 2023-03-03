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
    public getString() {
        return this.string;
    }

    public getScrapedAt() {
        return this.scrapedAt;
    }

}