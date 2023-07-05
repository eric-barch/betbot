import { Odd } from '@prisma/client';

import { OddButtonParser, SpecializedOddButtonParser } from '@/parsers/models/common-models';

export class FanDuelOddButtonParser implements SpecializedOddButtonParser {
  private readonly parentOddButtonParser: OddButtonParser;

  public constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public async update(): Promise<Odd> {
    return await this.parentOddButtonParser.writeTextContentToDbOdd();
  }
}