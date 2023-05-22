import * as db from '../../db';

class AllPageTypes {
    private wrappedGames: db.models.PageType | undefined;

    private wrappedActive: Array<db.models.PageType>;

    constructor() {
        this.wrappedActive = new Array<db.models.PageType>;
    }

    public async init() {    
        this.wrappedGames = await this.initPageType({
            name: 'games',
        })
    }
    
    private async initPageType({
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

        this.wrappedActive.push(pageType);
    
        return pageType;
    }

    get games(): db.models.PageType {
        if (!this.wrappedGames) {
            throw new Error(`wrappedGames is undefined.`);
        }

        return this.wrappedGames;
    }

    get active(): Array<db.models.PageType> {
        return this.wrappedActive;
    }
}

export const allPageTypes = new AllPageTypes();