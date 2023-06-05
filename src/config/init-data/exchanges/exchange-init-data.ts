export class ExchangeInitData {
  private wrappedName: string;

  constructor({
    name,
  }: {
    name: string,
  }) {
    this.wrappedName = name;
  }

  get name(): string {
    return this.wrappedName;
  }
}