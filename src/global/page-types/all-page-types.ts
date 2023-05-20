import * as db from '../../db';

export let gamesPageType: db.models.PageType;

export class AllPageTypes {
    public static async init() {
        console.log();
    
        gamesPageType = await this.initPageType({
            name: 'games',
        })
    }
    
    private static async initPageType({
        name,
    }: {
        name: string,
    }): Promise<db.models.PageType> {
        const [pageType, created] = await db.models.PageType.findOrCreate({
            where: {
                name,
            },
            defaults: {
                name,
            }
        });
    
        console.log(`'${name}' PageType initialized.`);
    
        return pageType;
    }
}