export abstract class ActiveModels<ModelType> {
  protected wrappedActive: Array<ModelType>;

  constructor() {
    this.wrappedActive = new Array<ModelType>();
  }

  public async init(): Promise<Array<ModelType>> {
    const activeModels = await this.initActiveModels();

    for (const activeModel of activeModels) {
      this.wrappedActive.push(activeModel);
    }

    return this.wrappedActive;
  }

  protected abstract initActiveModels(): Promise<Array<ModelType>>;

  get active(): Array<ModelType> {
    return this.wrappedActive;
  }
}
