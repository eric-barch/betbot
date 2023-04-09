import { sequelize } from './instance';
import { init } from './methods';
import { close } from './methods';

export {
    sequelize,
    init,
    close,
};
export * from './models';
