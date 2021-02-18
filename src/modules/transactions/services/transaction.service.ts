//#region Imports

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

import { Repository } from 'typeorm';
import { BaseCrudService } from '../../../common/base-crud.service';
import { TransactionEntity } from '../entities/transaction.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { isAdminUser, isNormalUser, isValid, resetFiltersOnCrud } from '../../../utils/functions';
import { UpdateTransactionPayload } from '../models/update-transaction.payload';
import { CreateTransactionPayload } from '../models/create-transaction.payload';

//#endregion

/**
 * A classe que representa o serviço que lida a entidade TransactionEntity
 */
@Injectable()
export class TransactionService extends BaseCrudService<TransactionEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectRepository(TransactionEntity)
    public repository: Repository<TransactionEntity>,
  ) {
    super(repository);
  }

  //#endregion

  //#region Crud Methods

  /**
   * Método que retorna uma lista com as entidades
   *
   * @param requestUser As informações do usuário da requisição
   * @param crudRequest As informações da requisição do CRUD
   */
  public async listMany(requestUser: UserEntity, crudRequest: CrudRequest): Promise<GetManyDefaultResponse<TransactionEntity> | TransactionEntity[]> {
    if (isAdminUser(requestUser))
        return await this.getMany(crudRequest);

    crudRequest = resetFiltersOnCrud(crudRequest);
    crudRequest.parsed.search = {
      $and: [
        {
          isActive: true,
        },
        ...crudRequest.parsed.search.$and,
      ],
    };

    return await this.getMany(crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: UserEntity, entityId: number, crudRequest?: CrudRequest): Promise<TransactionEntity> {
    let entity: TransactionEntity;

    if (!crudRequest)
      entity = await TransactionEntity.findById(entityId);
    else if (isAdminUser(requestUser)) {
      entity = await super.getOne(crudRequest).catch(() => null);
    } else {
      crudRequest = resetFiltersOnCrud(crudRequest);
      crudRequest.parsed.search = {
        $and: [
          {
            isActive: true,
          },
          ...crudRequest.parsed.search.$and,
        ],
      };

      entity = await super.getOne(crudRequest).catch(() => null);
    }

    if (!entity)
      throw new NotFoundException(`A entidade procurada pela identificação (${ entityId }) não foi encontrada.`);

    if (isAdminUser(requestUser))
      return entity;

    if (isNormalUser(requestUser))
      return entity;

    throw new ForbiddenException('Você não tem permissão para visualizar as informações dessa entidade.');
  }

  /**
   * Método que cria uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param payload As informações para a criação
   */
  public async create(requestUser: UserEntity, payload: CreateTransactionPayload): Promise<TransactionEntity> {
    const entity = this.getEntityFromPayload(payload);

    if (isAdminUser(requestUser))
        return await entity.save();

    throw new ForbiddenException(`Você não tem permissão para criar essa entidade.`);
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(requestUser: UserEntity, entityId: number, payload: UpdateTransactionPayload): Promise<TransactionEntity> {
    const entity = await TransactionEntity.findById(entityId);

    const entityToUpdate = new TransactionEntity({
      ...entity,
      ...this.getEntityFromPayload(payload, entityId),
    });

    if (isAdminUser(requestUser))
        return await entityToUpdate.save();

    throw new ForbiddenException(`Você não tem permissão para atualizar a entidade com a identificação (${ entityId }).`);
  }

  /**
   * Método que deleta uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade que está sendo procurada
   */
  public async delete(requestUser: UserEntity, entityId: number): Promise<void> {
    const entity = await TransactionEntity.findById(entityId);

    entity.isActive = false;

    if (isAdminUser(requestUser))
      return void await entity.save();

    throw new ForbiddenException(`Você não tem permissão para remover a entidade com a identificação (${ entityId }).`);
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que retorna as informações de uma entidade a partir das informações do payload
   *
   * @param payload As informações do payload
   * @param entityId A identificação da entidade
   */
  private getEntityFromPayload(payload: CreateTransactionPayload | UpdateTransactionPayload, entityId?: number): TransactionEntity {
    return new TransactionEntity({
      ...isValid(entityId) && { id: entityId },
      ...isValid(payload.isActive) && { isActive: payload.isActive },
    });
  }

  //#endregion

}
