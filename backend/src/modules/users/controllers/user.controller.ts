//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, GetManyDefaultResponse, Override, ParsedRequest } from '@nestjsx/crud';

import { BaseEntityCrudController } from '../../../common/base-entity-crud.controller';
import { ProtectTo, UnprotectedRoute } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { mapCrud } from '../../../utils/crud';
import { CreateUserPayload } from '../models/create-user.payload';
import { UpdateUserPayload } from '../models/update-user.payload';
import { GetManyDefaultResponseUserProxy, UserProxy } from '../models/user.proxy';
import { UserService } from '../services/user.service';

//#endregion

/**
 * A classe que representa o controlador que lida com os usuários
 */
@ApiBearerAuth()
@Crud({
  model: {
    type: UserEntity,
  },
  query: {
    exclude: ['password'],
  },
  routes: {
    exclude: [
      'updateOneBase',
      'createManyBase',
      'deleteOneBase',
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@Controller('users')
export class UserController extends BaseEntityCrudController<UserEntity, UserService> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    service: UserService,
  ) {
    super(service);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna as informações do usuário que esteja logado
   *
   * @param user As informações do usuário que está fazend oa requisição
   */
  @Get('me')
  @ApiOkResponse({ description: 'Get info about user logged.', type: UserProxy })
  @ProtectTo('user', 'admin')
  public getMe(@User() user: UserEntity): UserProxy {
    return mapCrud(UserProxy, user);
  }

  /**
   * Método que retorna várias informações da entidade
   *
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('admin')
  @Override()
  @ApiOkResponse({ type: GetManyDefaultResponseUserProxy })
  public getMany(@ParsedRequest() crudRequest: CrudRequest): Promise<GetManyDefaultResponse<UserProxy>> {
    return this.base.getManyBase(crudRequest).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('user', 'admin')
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public async getOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @ParsedRequest() crudRequest: CrudRequest): Promise<UserProxy> {
    return await this.service.get(requestUser, +entityId, crudRequest).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação da entidade
   */
  @UnprotectedRoute()
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public createOne(@User() requestUser: UserEntity, @Body() payload: CreateUserPayload): Promise<UserProxy> {
    return this.service.create(requestUser, payload).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo('user', 'admin')
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public async replaceOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @Body() payload: UpdateUserPayload): Promise<UserProxy> {
    return await this.service.update(requestUser, +entityId, payload).then(response => mapCrud(UserProxy, response));
  }

  //#endregion

}
