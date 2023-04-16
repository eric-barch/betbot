import * as localModels from '../../../../../../local';

export async function updateValues(this: localModels.Odd): Promise<void> {
    const priceElement = this.priceElement;
    const valueElement = this.valueElement;

    if (!priceElement) {
        await this.setPrice(null);
    } else {
        const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

        if (!priceJson) {
            await this.setPrice(null);
        } else {
            const priceJsonClean = priceJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
            const price = Number(priceJsonClean);
            await this.setPrice(price);
        }
    }

    if (!valueElement) {
        await this.setValue(null);
        return;
    }

    const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();

    if (!valueJson) {
        this.setValue(null);
        return;
    }

    const valueJsonClean = valueJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
    const value = Number(valueJsonClean);
    await this.setValue(value);
}