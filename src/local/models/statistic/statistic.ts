import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Statistic {
    // public properties
    public name: string; // e.g. 'spread', 'winner', 'total', 'devin-booker-points', 'first-basket'
    
    // private properties

    // public linked objects
    public game: localModels.Game;
    public oddSet: localModels.OddSet;

    // private linked objects

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
    }

    // public async constructor
    static async create({
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

        globalModels.allStatistics.add(newStatistic);

        return newStatistic;
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

    // public static methods

    // getters and setters
}