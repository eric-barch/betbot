import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Statistic {
    // public properties
    public name: string; // e.g. 'spread', 'winner', 'total', 'devin-booker-points', 'first-basket'
    
    // private properties
    private updateOddsFunction: Function;

    // public linked objects
    public game: localModels.Game;
    public oddSet: localModels.OddSet;

    // private linked objects

    // private sequelize object
    public wrappedSqlStatistic: databaseModels.Statistic | null;

    // private constructor
    private constructor({
        name,
        game,
        updateOddsFunction,
    }: {
        name: string,
        game: localModels.Game,
        updateOddsFunction: Function,
    }) {
        this.name = name;

        this.updateOddsFunction = updateOddsFunction.bind(this);
        
        this.game = game;
        this.oddSet = new localModels.OddSet;

        this.wrappedSqlStatistic = null;
    }

    // public async constructor
    static async create({
        name,
        game,
        updateOddsFunction,
    }: {
        name: string,
        game: localModels.Game,
        updateOddsFunction: Function,
    }): Promise<Statistic> {
        const newStatistic = new Statistic({
            name: name,
            game: game,
            updateOddsFunction: updateOddsFunction,
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
    public matches({
        name,
        game,
    }: {
        name: string,
        game: localModels.Game,
    }) {
        const nameMatches = (this.name === name);
        const gameMatches = (this.game === game);

        if (nameMatches && gameMatches) {
            return true;
        }

        return false;
    }

    public async updateOdds({
        exchange,
    }: {
        exchange: localModels.Exchange,
    }) {
        // Every statistic will have a unique function to update its odds.
        await this.updateOddsFunction({
            exchange: exchange,
            statistic: this,
        });
    }

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