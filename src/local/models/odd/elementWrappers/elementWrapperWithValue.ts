import { ElementWrapper } from "./elementWrapper";

import { Exchange, Game, Odd } from "../../../../local/models";

export class ElementWrapperWithValue extends ElementWrapper {
    private wrappedValue: number | null;

    constructor({
        exchange,
        game,
        odd,
        updateElementFunction,
    }: {
        exchange: Exchange,
        game: Game,
        odd: Odd,
        updateElementFunction: Function,
    }) {
        super({
            exchange: exchange,
            game: game,
            odd: odd,
            updateElementFunction: updateElementFunction,
        });
        this.wrappedValue = null;
    }

    public async updateValue(): Promise<boolean> {
        const element = await this.element;
        
        if (!element) {
            if (this.value) {
                this.value = null;
                return true;
            }
            return false;
        }
        
        let elementJson = await (await element.getProperty('textContent')).jsonValue();
        let elementValue;

        if (elementJson) {
            if (typeof elementJson === 'string') {
                elementJson = elementJson.replace(/[^\d.-]/g, '');
            }
            
            elementValue = Number(elementJson);
        } else {
            elementValue = null;
        }

        if (elementValue !== this.value) {
            console.log(`NEW: ${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr}: ${elementValue}`);
            this.value = elementValue;
            return true;
        }

        return false;
    }

    get value(): number | null {
        return this.wrappedValue;
    }

    set value(value: number | string | null) {
        let valueToSet;

        if (value) {
            if (typeof value === 'string') {
                value = value.replace(/[^\d.-]/g, '');
            }
            valueToSet = Number(value);
        } else {
            valueToSet = null;
        }

        this.wrappedValue = valueToSet;

        //await this.odd.sqlOdd.
    }
}