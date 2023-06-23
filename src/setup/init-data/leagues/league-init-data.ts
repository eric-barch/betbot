export class LeagueInitData {
  private wrappedName: string;
  private wrappedAbbreviation: string;

  public constructor({
    name,
    abbreviation,
  }: {
    name: string,
    abbreviation: string,
  }) {
    this.wrappedName = name;
    this.wrappedAbbreviation = abbreviation;
  }

  public get name(): string {
    return this.wrappedName;
  }

  public get abbreviation(): string {
    return this.wrappedAbbreviation;
  }
}