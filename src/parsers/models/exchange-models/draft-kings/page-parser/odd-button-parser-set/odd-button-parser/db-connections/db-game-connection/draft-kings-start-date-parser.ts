import * as c from 'chrono-node';
import * as p from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models';

export class DraftKingsStartDateParser {
  private parentOddButtonParser: OddButtonParser;
  private wrappedDateString: string | undefined;
  private wrappedTimeString: string | undefined;
  private wrappedStartDate: Date | undefined;

  constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public async parse(): Promise<Date> {
    await this.parseDateString();
    await this.parseTimeString();
    this.parseStartDate();
    return this.startDate;
  }

  private async parseDateString(): Promise<string> {
    const dateTableElement = await this.getDateTableElement();
    const dateTableHeaderElement = await dateTableElement.$('.always-left.column-header');

    if (!dateTableHeaderElement) {
      throw new Error(`dateTableHeaderElement is null.`);
    }

    const dateString = await (await dateTableHeaderElement.getProperty('textContent')).jsonValue();

    if (!dateString) {
      throw new Error(`dateString is null.`);
    }

    this.dateString = dateString;

    return this.dateString;
  }

  private async getDateTableElement(): Promise<p.ElementHandle> {
    let ancestor = this.parentOddButtonParser.buttonElement;

    const classNameToFind = 'parlay-card-10-a';

    while (ancestor) {
      const className = await (await ancestor.getProperty('className')).jsonValue();

      if (className === classNameToFind) {
        return ancestor;
      }

      const parentElement = await ancestor.$('xpath/..');

      if (!parentElement) {
        throw new Error(`parentElement is null.`);
      }

      ancestor = parentElement;
    }

    throw new Error(`Did not find dateTableElement.`);
  }

  private async parseTimeString(): Promise<string> {
    const teamRowElement = await this.getTeamRowElement();
    const timeElement = await teamRowElement.$('.event-cell__start-time');

    if (!timeElement) {
      throw new Error(`timeElement is null.`);
    }

    const timeString = await (await timeElement.getProperty('textContent')).jsonValue();

    if (!timeString) {
      throw new Error(`timeString is null.`);
    }

    this.timeString = timeString;

    return this.timeString;
  }

  private async getTeamRowElement(): Promise<p.ElementHandle> {
    let ancestor = this.parentOddButtonParser.buttonElement;

    const nodeNameToFind = 'tr';

    while (ancestor) {
      const nodeName = await (await ancestor.getProperty('nodeName')).jsonValue();

      if (nodeName.toLowerCase() === nodeNameToFind) {
        return ancestor;
      }

      const parentElement = await ancestor.$('xpath/..');

      if (!parentElement) {
        throw new Error(`parentElement is null.`);
      }

      ancestor = parentElement;
    }

    throw new Error(`Did not find teamRowElement.`);
  }

  private parseStartDate(): Date {
    const startDateString = `${this.dateString} ${this.timeString}`;
    this.startDate = c.parseDate(startDateString);
    return this.startDate;
  }

  private set dateString(dateString: string) {
    this.wrappedDateString = dateString;
  }

  private get dateString(): string {
    if (!this.wrappedDateString) {
      throw new Error(`wrappedDateString is undefined.`);
    }

    return this.wrappedDateString;
  }

  private set timeString(timeString: string) {
    this.wrappedTimeString = timeString;
  }

  private get timeString(): string {
    if (!this.wrappedTimeString) {
      throw new Error(`wrappedTimeString is undefined.`);
    }

    return this.wrappedTimeString;
  }

  private set startDate(startDate: Date) {
    this.wrappedStartDate = startDate;
  }

  public get startDate(): Date {
    if (!this.wrappedStartDate) {
      throw new Error(`wrappedStartDate is undefined.`);
    }

    return this.wrappedStartDate;
  }
}