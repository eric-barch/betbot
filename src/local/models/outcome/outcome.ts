import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Outcome {
    public name: string;
    public game: localModels.Game;
    public odds: localModels.OddSet;
    private wrappedOppositeOutcome: Outcome | null;
    public wrappedSqlOutcome: databaseModels.Outcome | null;

    private constructor({
        name,
        game,
    }: {
        name: string,
        game: localModels.Game,
    }) {
        this.name = name;
        
        this.game = game;
        this.odds = new localModels.OddSet;
        this.wrappedOppositeOutcome = null;

        this.wrappedSqlOutcome = null;
    }

    // public async constructor
    static async create({
        game,
        name,
        oppositeOutcome,
    }: {
        game: localModels.Game,
        name: string,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        const newOutcome = new Outcome({
            name: name,
            game: game,
        });

        if (oppositeOutcome) {
            newOutcome.oppositeOutcome = oppositeOutcome;
        }

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
    get oppositeOutcome(): Outcome {
        if (!this.wrappedOppositeOutcome) {
            throw new Error(`wrappedOppositeOutcome is null.`);
        }

        return this.wrappedOppositeOutcome;
    }

    set oppositeOutcome(oppositeOutcome: Outcome) {
        this.wrappedOppositeOutcome = oppositeOutcome;
        oppositeOutcome.wrappedOppositeOutcome = this;
    }

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