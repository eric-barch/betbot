import * as db from '../../db';

export let draftKings: db.models.Exchange;
export let fanDuel: db.models.Exchange;
export let sugarHouse: db.models.Exchange;

export class AllExchanges {
    public static async init() {
        console.log();
    
        draftKings = await this.initExchange({
            name: 'DraftKings',
        });
    
        fanDuel = await this.initExchange({
            name: 'FanDuel',
        });
    
        sugarHouse = await this.initExchange({
            name: 'SugarHouse',
        })
    }

    private static async initExchange({
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
    
        console.log(`${name} initialized.`);
    
        return exchange;
    }
}