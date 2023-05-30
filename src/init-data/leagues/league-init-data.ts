export class LeagueInitData {
  private wrappedName: string;
  private wrappedAbbreviation: string;

  constructor({
    name,
    abbreviation,
  }: {
    name: string,
    abbreviation: string,
  }) {
    this.wrappedName = name;
    this.wrappedAbbreviation = abbreviation;
  }

  get name(): string {
    return this.wrappedName;
  }

  get abbreviation(): string {
    return this.wrappedAbbreviation;
  }
}

export const mlb = new LeagueInitData({
  name: 'Major League Baseball',
  abbreviation: 'MLB',
});

export const nba = new LeagueInitData({
  name: 'National Basketball Association',
  abbreviation: 'NBA',
})

export const nfl = new LeagueInitData({
  name: 'National Football League',
  abbreviation: 'NFL',
})