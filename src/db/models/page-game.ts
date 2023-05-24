import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { Page } from './page';
import { Game } from './game';

export class PageGame extends s.Model<
  s.InferAttributes<PageGame, { omit: 'page' | 'game' }>,
  s.InferCreationAttributes<PageGame, { omit: 'page' | 'game' }>
> {
  declare id: s.CreationOptional<number>;
  declare pageId: s.ForeignKey<Page['id']>;
  declare gameId: s.ForeignKey<Game['id']>;
  declare page: s.NonAttribute<Page>;
  declare game: s.NonAttribute<Game>;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;

  // belongsTo(Page)
  declare createPage: s.BelongsToCreateAssociationMixin<Page>;
  declare getPage: s.BelongsToGetAssociationMixin<Page>;
  declare setPage: s.BelongsToSetAssociationMixin<Page, number>;

  // belongsTo(Game)
  declare createGame: s.BelongsToCreateAssociationMixin<Game>;
  declare getGame: s.BelongsToGetAssociationMixin<Game>;
  declare setGame: s.BelongsToSetAssociationMixin<Game, number>;
}

PageGame.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'PageGames',
  }
);
