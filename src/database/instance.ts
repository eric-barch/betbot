import * as sequelize from 'sequelize';

export const sequelizeInstance = new sequelize.Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});