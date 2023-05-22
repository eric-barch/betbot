export class ParserKey{
    private wrappedExchangeId: number;
    private wrappedLeagueId: number;
    private wrappedPageTypeId: number;

    constructor({
        exchangeId,
        leagueId,
        pageTypeId,
    }: {
        exchangeId: number,
        leagueId: number,
        pageTypeId: number,
    }) {
        this.wrappedExchangeId = exchangeId;
        this.wrappedLeagueId = leagueId;
        this.wrappedPageTypeId = pageTypeId;
    }

    public matches({
        exchangeId,
        leagueId,
        pageTypeId,
    }: {
        exchangeId: number,
        leagueId: number,
        pageTypeId: number,
    }): boolean {
        const exchangeIdMatches = (this.wrappedExchangeId === exchangeId);
        const leagueIdMatches = (this.wrappedLeagueId === leagueId);
        const pageTypeIdMatches = (this.wrappedPageTypeId === pageTypeId);

        if (exchangeIdMatches && leagueIdMatches && pageTypeIdMatches) {
            return true;
        }

        return false;
    }
}