import { OddButtonWrapper, SpecializedOddButtonWrapper } from '@/parsers/models/common-models';

export class FanDuelOddButtonWrapper implements SpecializedOddButtonWrapper {
  private readonly parentOddButtonWrapper: OddButtonWrapper;
  private wrappedReferenceSelector: string | undefined;

  public constructor({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }) {
    this.parentOddButtonWrapper = parentOddButtonWrapper;
    this.referenceSelector = 'li';
  }

  public async generateReferenceSelector(): Promise<string> {
    return this.referenceSelector;
  }

  /**TODO: Not sure this does anything for FanDuel and not sure it should be included as a step in
   * the common OddButtonWrapper. Might want to specify to DraftKings.  */
  public async verifyOddButtonPosition(): Promise<boolean> {
    return true;
  }

  private set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  private get referenceSelector(): string {
    if (this.wrappedReferenceSelector === undefined) {
      throw new Error(`Reference selector is undefined.`);
    }

    return this.wrappedReferenceSelector;
  }
}