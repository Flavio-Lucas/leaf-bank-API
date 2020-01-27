//#region Imports

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';

import { BaseEntity } from './base-entity';

//#endregion

/**
 * A classe que representa o serviço que lida com as imagens
 */
export class BaseCrudService<TEntity extends BaseEntity> extends TypeOrmCrudService<TEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    public readonly repository: Repository<TEntity>,
  ) {
    super(repository);
  }

  //#endregion

}
