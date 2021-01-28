//#region Imports

import { NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';

import { TypeOrmValueTypes } from '../models/enums/type-orm-value.types';
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

  /**
   * Método que procura uma entidade pela sua identificação
   *
   * @param entityId A identificação da entidade
   * @param validateIsActive Diz se deve validar se a entidade está ativa
   * @param relations A lista de relações que você pode incluir
   */
  public async findById(entityId: number, validateIsActive: boolean = true, relations?: string[]): Promise<TEntity> {
    const entity = await this.repository.findOne({
      where: {
        id: entityId,
        ...validateIsActive && { isActive: TypeOrmValueTypes.TRUE },
      },
      relations,
    });

    if (!entity)
      throw new NotFoundException(`A entidade procurada pela identificação (${ entityId }) não foi encontrada.`);

    return entity;
  }

  //#endregion

}
