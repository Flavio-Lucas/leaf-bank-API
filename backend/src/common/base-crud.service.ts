//#region Imports

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';

import { VerifyProxy } from '../models/proxys/verify.proxy';
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

  //#region Public Methods

  /**
   * Método que verifica se algumas entidades existem
   *
   * @param ids A lista de identificações das entidades
   */
  public async exists(ids: number[]): Promise<VerifyProxy> {
    const count = await this.repository.createQueryBuilder().whereInIds(ids).getCount();

    return new VerifyProxy(count === ids.length);
  }

  //#endregion

}
