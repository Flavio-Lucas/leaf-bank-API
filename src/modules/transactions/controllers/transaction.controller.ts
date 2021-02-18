//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { TransactionService } from '../services/transaction.service';
import { BaseEntityCrudController } from '../../../common/base-entity-crud.controller';
import { RolesEnum } from '../../auth/models/roles.enum';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { GetManyDefaultResponseTransactionProxy, TransactionProxy } from '../models/transaction.proxy';
import { UserEntity } from '../../users/entities/user.entity';
import { User } from '../../../decorators/user/user.decorator';
import { mapCrud } from '../../../utils/crud';
import { TransactionEntity } from '../entities/transaction.entity';
import { UpdateTransactionPayload } from '../models/update-transaction.payload';
import { CreateTransactionPayload } from '../models/create-transaction.payload';

//#endregion

/**
 * A classe que representa o controller que lida a entidade TransactionEntity
 */
@ApiBearerAuth()
@Crud({
  model: {
    type: TransactionEntity,
  },
  routes: {
    exclude: [
      'updateOneBase',
      'createManyBase',
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController extends BaseEntityCrudController<TransactionEntity, TransactionService> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    service: TransactionService,
  ) {
    super(service);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna várias informações da entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: GetManyDefaultResponseTransactionProxy })
  public getMany(@User() requestUser: UserEntity, @ParsedRequest() crudRequest: CrudRequest): Promise<GetManyDefaultResponseTransactionProxy> {
    return this.service.listMany(requestUser, crudRequest).then(response => mapCrud(response));
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: TransactionProxy })
  public async getOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @ParsedRequest() crudRequest: CrudRequest): Promise<TransactionProxy> {
    return await this.service.get(requestUser, entityId, crudRequest).then(response => mapCrud(response));
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param payload As informações para a criação da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: TransactionProxy })
  public createOne(@User() requestUser: UserEntity, @Body() payload: CreateTransactionPayload): Promise<TransactionProxy> {
    return this.service.create(requestUser, payload).then(response => mapCrud(response));
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: TransactionProxy })
  public async replaceOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @Body() payload: UpdateTransactionPayload): Promise<TransactionProxy> {
    return await this.service.update(requestUser, entityId, payload).then(response => mapCrud(response));
  }

  /**
   * Método que deleta uma entidade
   *
   * @param requestUser As informações do usuário da requisição
   * @param entityId A identificação da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: void 0 })
  public async deleteOne(@User() requestUser: UserEntity, @Param('id') entityId: number): Promise<void> {
    return await this.service.delete(requestUser, entityId);
  }

  //#endregion

}
