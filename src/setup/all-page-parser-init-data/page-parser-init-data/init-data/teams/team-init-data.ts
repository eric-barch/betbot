export class TeamInitData {
  private wrappedRegionFull: string;
  private wrappedRegionAbbr: string;
  private wrappedIdentifierFull: string;
  private wrappedIdentifierAbbr: string;

  public constructor({
    regionFull,
    regionAbbr,
    identifierFull,
    identifierAbbr,
  }: {
    regionFull: string,
    regionAbbr: string,
    identifierFull: string,
    identifierAbbr: string,
  }) {
    this.wrappedRegionFull = regionFull;
    this.wrappedRegionAbbr = regionAbbr;
    this.wrappedIdentifierFull = identifierFull;
    this.wrappedIdentifierAbbr = identifierAbbr;
  }

  public get regionFull(): string {
    return this.wrappedRegionFull;
  }

  public get regionAbbr(): string {
    return this.wrappedRegionAbbr;
  }

  public get identifierFull(): string {
    return this.wrappedIdentifierFull;
  }

  public get identifierAbbr(): string {
    return this.wrappedIdentifierAbbr;
  }
}