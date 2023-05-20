import { Sequelize } from 'sequelize';

export const sequelizeInstance = new Sequelize(
    'betbot',
    'root',
    'f9R#@hY82l',
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: false,
    }
);