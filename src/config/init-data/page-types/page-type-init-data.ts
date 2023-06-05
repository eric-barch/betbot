export class PageTypeInitData {
  private wrappedName: string;

  public constructor({
    name,
  }: {
    name: string,
  }) {
    this.wrappedName = name;
  }

  public get name(): string {
    return this.wrappedName;
  }
}