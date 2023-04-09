import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Game {
    // public properties
    public startDate: Date;

    // private properties

    // public linked objects
    public awayTeam: localModels.Team;
    public homeTeam: localModels.Team;
    public exchangeSet: localModels.ExchangeSet;
    public statisticSet: localModels.StatisticSet;

    // private linked objects

    // private constructor
    private constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }) {
        this.startDate = Game.roundDateToNearestInterval(startDate);

        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.exchangeSet = new localModels.ExchangeSet();
        this.statisticSet = new localModels.StatisticSet();
    }

    // public async constructor
    static async create({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): Promise<Game> {
        const newGame = new Game({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        })

        await newGame.updateStatisticSet();

        globalModels.allGames.add(newGame);

        return newGame;
    }

    // public instance methods
    public matches({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): boolean {
        startDate = Game.roundDateToNearestInterval(startDate);

        const awayTeamSame = (this.awayTeam === awayTeam);
        const homeTeamSame = (this.homeTeam === homeTeam);
        const startDateSame = (this.startDate.getTime() === startDate.getTime());

        if (awayTeamSame && homeTeamSame && startDateSame) {
            return true;
        }

        return false;
    }

    public async updateStatisticSet(): Promise<localModels.StatisticSet> {
        const spread = await this.statisticSet.findOrCreate({
            game: this,
            name: 'spread',
        });

        const moneyline = await this.statisticSet.findOrCreate({
            game: this,
            name: 'moneyline',
        });

        const total = await this.statisticSet.findOrCreate({
            game: this,
            name: 'total',
        })

        this.statisticSet.add(spread);
        this.statisticSet.add(moneyline);
        this.statisticSet.add(total);

        return this.statisticSet;
    }

    // public static methods
    static roundDateToNearestInterval(date: Date): Date {
        const ROUND_INTERVAL = 15;
        
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_INTERVAL) * ROUND_INTERVAL;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);

        return roundedDate;
    }

    // getters and setters
    get regionAbbrIdentifierAbbr(): string {
        const regionAbbrIdentifierAbbr = `${this.awayTeam.regionAbbrIdentifierAbbr} @ ${this.homeTeam.regionAbbrIdentifierAbbr}`;
        return regionAbbrIdentifierAbbr;
    }

    get regionAbbrIdentifierFull(): string {
        const regionAbbrIdentifierFull = `${this.awayTeam.regionAbbrIdentifierFull} @ ${this.homeTeam.regionAbbrIdentifierFull}`;
        return regionAbbrIdentifierFull;
    }

    get regionFullIdentifierFull(): string {
        const regionFullIdentifierFull = `${this.awayTeam.regionFullIdentifierFull} @ ${this.homeTeam.regionFullIdentifierFull}`;
        return regionFullIdentifierFull;
    }
}