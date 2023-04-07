import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Statistic {
    // public properties
    public name: string; // e.g. 'spread', 'winner', 'total', 'devin-booker-points', 'first-basket'
    
    // private properties

    // public linked objects
    private game: localModels.Game;
    public oddSet: localModels.OddSet;

    // private linked objects

    // private sequelize object
    public wrappedSqlStatistic: databaseModels.Statistic | null;

    // private constructor
    private constructor({
        name,
        game,
    }: {
        name: string,
        game: localModels.Game,
    }) {
        this.name = name;
        
        this.game = game;
        this.oddSet = new localModels.OddSet;

        this.wrappedSqlStatistic = null;
    }

    // public async constructor
    public static async create({
        name,
        game,
    }: {
        name: string,
        game: localModels.Game,
    }): Promise<Statistic> {
        const newStatistic = new Statistic({
            name: name,
            game: game,
        });

        await newStatistic.initSqlStatistic();

        globalModels.allStatistics.add(newStatistic);

        return newStatistic;
    }

    // private sequelize instance constructor
    public async initSqlStatistic(): Promise<databaseModels.Statistic> {
        const game = this.game;

        const gameId = game.sqlGame.get('id');

        await databaseModels.Statistic.findOrCreate({
            where: {
                gameId: gameId,
                name: this.name,
            }
        }).then(async ([sqlStatistic, created]) => {
            if (!created) {
                await sqlStatistic.update({

                });
            }

            this.sqlStatistic = sqlStatistic;
        })

        return this.sqlStatistic;
    }

    // public instance methods

    // public static methods

    // getters and setters
    get sqlStatistic(): databaseModels.Statistic {
        if (!this.wrappedSqlStatistic) {
            throw new Error(`${this.game.regionAbbrIdentifierAbbr} ${this.name} sqlStatistic is null.`)
        }

        return this.wrappedSqlStatistic;
    }

    set sqlStatistic(sqlStatistic: databaseModels.Statistic) {
        this.wrappedSqlStatistic = sqlStatistic;
    }
}