import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllExchanges implements IGlobal<db.models.Exchange> {
    private wrappedDraftKings: db.models.Exchange | undefined;
    private wrappedFanDuel: db.models.Exchange | undefined;
    private wrappedSugarHouse: db.models.Exchange | undefined;
    private wrappedActive: Array<db.models.Exchange>;

    constructor() {
        this.wrappedActive = new Array<db.models.Exchange>;
    }

    public async init(): Promise<Array<db.models.Exchange>> {    
        this.wrappedDraftKings = await this.initExchange({
            name: 'DraftKings',
        });
        this.wrappedActive.push(this.wrappedDraftKings);
    
        this.wrappedFanDuel = await this.initExchange({
            name: 'FanDuel',
        });
        this.wrappedActive.push(this.wrappedFanDuel);
    
        this.wrappedSugarHouse = await this.initExchange({
            name: 'SugarHouse',
        });
        this.wrappedActive.push(this.wrappedSugarHouse);

        return this.wrappedActive;
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