import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('betbot', 'root', 'f9R#@hY82l', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false,
});
