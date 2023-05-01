import * as databaseModels from '../../../database';
import * as global from '../../../global';
import * as models from '../../../models';

export enum OutcomeType {
    SpreadAway = 'spread_away',
    SpreadHome = 'spread_home',
    MoneylineAway = 'moneyline_away',
    MoneylineHome = 'moneyline_home',
    TotalOver = 'total_over',
    TotalUnder = 'total_under'
}

export class Outcome {
    private wrappedType: OutcomeType;
    private wrappedGame: models.Game;
    private wrappedOdds: models.OddSet;
    private wrappedOppositeOutcome: Outcome | null;
    private wrappedSqlOutcome: databaseModels.Outcome | null;

    private constructor({
        type,
        game,
    }: {
        type: OutcomeType,
        game: models.Game,
    }) {
        this.wrappedType = type;
        this.wrappedGame = game;
        this.wrappedOdds = new models.OddSet();
        this.wrappedOppositeOutcome = null;
        this.wrappedSqlOutcome = null;

        game.outcomes.add(this);
        global.allOutcomes.add(this);
    }

    static async create({
        type,
        game,
        oppositeOutcome,
    }: {
        type: OutcomeType,
        game: models.Game,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        const newOutcome = new Outcome({
            type: type,
            game: game,
        });

        if (oppositeOutcome) {
            newOutcome.oppositeOutcome = oppositeOutcome;
        }

        await newOutcome.initSqlOutcome();

        return newOutcome;
    }

    public async initSqlOutcome(): Promise<databaseModels.Outcome> {
        const type = this.type;
        const gameId = this.game.sqlGame.get('id');

        await databaseModels.Outcome.findOrCreate({
            where: {
                type: type,
                gameId: gameId,
            }
        }).then(async ([sqlOutcome, created]) => {
            this.wrappedSqlOutcome = sqlOutcome;
        })

        return this.sqlOutcome;
    }

    public matches({
        type,
        game,
    }: {
        type: OutcomeType,
        game: models.Game,
    }) {
        const typeMatches = (this.type === type);
        const gameMatches = (this.game === game);

        if (typeMatches && gameMatches) {
            return true;
        }

        return false;
    }

    get type(): OutcomeType {
        return this.wrappedType;
    }

    get game(): models.Game {
        return this.wrappedGame;
    }

    get team(): models.Team {
        if (this.type === OutcomeType.SpreadAway ||
            this.type === OutcomeType.MoneylineAway ||
            this.type === OutcomeType.TotalOver) {
                return this.game.awayTeam;
        }
        
        if (this.type === OutcomeType.SpreadHome ||
            this.type === OutcomeType.MoneylineHome ||
            this.type === OutcomeType.TotalUnder) {
                return this.game.homeTeam;
        }

        throw new Error(`Did not find corresponding outcome team.`);
    }

    get odds(): models.OddSet {
        return this.wrappedOdds;
    }

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
            throw new Error(`${this.game.regionAbbrIdentifierAbbr} ${this.type} sqlOutcome is null.`)
        }

        return this.wrappedSqlOutcome;
    }
}