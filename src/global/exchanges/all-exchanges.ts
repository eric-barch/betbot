import * as db from '../../db';

class AllExchanges {
    private wrappedDraftKings: db.models.Exchange | undefined;
    private wrappedFanDuel: db.models.Exchange | undefined;
    private wrappedSugarHouse: db.models.Exchange | undefined;

    private wrappedActive: Array<db.models.Exchange>;

    constructor() {
        this.wrappedActive = new Array<db.models.Exchange>;
    }

    public async init() {    
        this.wrappedDraftKings = await this.initExchange({
            name: 'DraftKings',
        });
    
        this.wrappedFanDuel = await this.initExchange({
            name: 'FanDuel',
        });
    
        this.wrappedSugarHouse = await this.initExchange({
            name: 'SugarHouse',
        })
    }

    private async initExchange({
        name,
    }: {
        name: string,
    }): Promise<db.models.Exchange> {
        const [exchange, created] = await db.models.Exchange.findOrCreate({
            where: {
                name,
            },
            defaults: {
                name,
            }
        });

        this.active.push(exchange);
    
        return exchange;
    }

    get draftKings(): db.models.Exchange {
        if (!this.wrappedDraftKings) {
            throw new Error(`wrappedDraftKings is undefined.`);
        }

        return this.wrappedDraftKings;
    }

    get fanDuel(): db.models.Exchange {
        if (!this.wrappedFanDuel) {
            throw new Error( `wrappedFanDuel is undefined.`);
        }

        return this.wrappedFanDuel;
    }

    get sugarHouse(): db.models.Exchange {
        if (!this.wrappedSugarHouse) {
            throw new Error(`wrappedSugarHouse is undefined.`);
        }

        return this.wrappedSugarHouse;
    }

    get active(): Array<db.models.Exchange> {
        return this.wrappedActive;
    }
}

export const allExchanges = new AllExchanges();