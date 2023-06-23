import { Odd } from '@prisma/client';

import {
  OddButtonParser, SpecializedOddButtonParser
} from '@/parsers/models/common-models';

export class DraftKingsOddButtonParser implements SpecializedOddButtonParser {
  private readonly parentOddButtonParser: OddButtonParser;

  public constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public async updateOdd(): Promise<Odd> {
    await this.parentOddButtonParser.resetOddButtonFromReference();
    return await this.parentOddButtonParser.writeTextContentToDb();
  }
}