import { parseDate } from 'chrono-node';
import { ElementHandle } from 'puppeteer';

import { DbGameInitializer } from '@/parsers/models/common-models';

export class DraftKingsStartDateParser {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private wrappedDateString: string | undefined;
  private wrappedTimeString: string | undefined;
  private wrappedStartDate: Date | undefined;

  private constructor({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }) {
    this.parentDbGameInitializer = parentDbGameInitializer;
  }

  public static async create({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<DraftKingsStartDateParser> {
    const startDateParser = new DraftKingsStartDateParser({ parentDbGameInitializer });
    await startDateParser.init();
    return startDateParser;
  }

  public async init(): Promise<DraftKingsStartDateParser> {
    this.dateString = await this.parseDateString();
    this.timeString = await this.parseTimeString();
    this.startDate = this.parseStartDate();
    return this;
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

  private async getDateTableElement(): Promise<ElementHandle> {
    let ancestor = this.parentDbGameInitializer.button;

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

  private async getTeamRowElement(): Promise<ElementHandle> {
    let ancestor = this.parentDbGameInitializer.button;

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
    const startDate = parseDate(startDateString);

    /**Check if startDate is more than a week in the past. If it is, chrono-node likely parsed it
     * incorrectly. Add a year to the start date to fix. */
    const currentDate = new Date();
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

    if (startDate.getTime() < currentDate.getTime() - oneWeekInMilliseconds) {
      startDate.setFullYear(startDate.getFullYear() + 1); // Add a year to the start date
    }

    this.startDate = startDate;
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