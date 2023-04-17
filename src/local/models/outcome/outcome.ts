import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Outcome {
    // public properties
    public name: string;

    // public linked objects
    public game: localModels.Game;
    public oddSet: localModels.OddSet;

    // private sequelize object
    public wrappedSqlOutcome: databaseModels.Outcome | null;

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

        this.wrappedSqlOutcome = null;
    }

    // public async constructor
    static async create({
        game,
        name,
    }: {
        game: localModels.Game,
        name: string,
    }): Promise<Outcome> {
        const newOutcome = new Outcome({
            name: name,
            game: game,
        });

        await newOutcome.initSqlOutcome();

        globalModels.allOutcomes.add(newOutcome);

        return newOutcome;
    }

    // private sequelize instance constructor
    public async initSqlOutcome(): Promise<databaseModels.Outcome> {
        const game = this.game;

        const gameId = game.sqlGame.get('id');

        await databaseModels.Outcome.findOrCreate({
            where: {
                gameId: gameId,
                name: this.name,
            }
        }).then(async ([sqlOutcome, created]) => {
            if (!created) {
                await sqlOutcome.update({

                });
            }

            this.sqlOutcome = sqlOutcome;
        })

        return this.sqlOutcome;
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

    // getters and setters
    get sqlOutcome(): databaseModels.Outcome {
        if (!this.wrappedSqlOutcome) {
            throw new Error(`${this.game.regionAbbrIdentifierAbbr} ${this.name} sqlOutcome is null.`)
        }

        return this.wrappedSqlOutcome;
    }

    set sqlOutcome(sqlOutcome: databaseModels.Outcome) {
        this.wrappedSqlOutcome = sqlOutcome;
    }
}