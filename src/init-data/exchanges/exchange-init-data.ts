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

export const draftKings = new ExchangeInitData({ name: 'DraftKings' });
export const fanDuel = new ExchangeInitData({ name: 'FanDuel' });
export const sugarHouse = new ExchangeInitData({ name: 'SugarHouse' });