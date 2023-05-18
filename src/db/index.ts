import { sequelize } from './instance';
import { init } from './instanceMethods';
import { close } from './instanceMethods';

export {
    sequelize,
    init,
    close,
};
export * from './models';

