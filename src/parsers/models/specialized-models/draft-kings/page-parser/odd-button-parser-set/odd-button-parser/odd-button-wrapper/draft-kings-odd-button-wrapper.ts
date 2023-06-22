import {
  OddButtonParser, OddButtonWrapper, SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';

export class DraftKingsOddButtonWrapper implements SpecializedOddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parentOddButtonWrapper: OddButtonWrapper;

  public constructor({
    parentOddButtonParser,
    parentOddButtonWrapper,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentOddButtonWrapper: OddButtonWrapper,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parentOddButtonWrapper = parentOddButtonWrapper;
  }

  public async generateReferenceSelector(): Promise<string> {
    return 'tr';
  }
}