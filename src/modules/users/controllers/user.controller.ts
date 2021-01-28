//#region Imports

import { Body, ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';

import { BaseEntityCrudController } from '../../../common/base-entity-crud.controller';
import { ProtectTo, UnprotectedRoute } from '../../../decorators/protect/protect.decorator';
import { User } from '../../../decorators/user/user.decorator';
import { mapCrud } from '../../../utils/crud';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../entities/user.entity';
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
  @ApiOperation({ summary: 'Returns info about user logged.' })
  @Get('me')
  @ApiOkResponse({ description: 'Get info about user logged.', type: UserProxy })
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  public getMe(@User() user: UserEntity): UserProxy {
    return mapCrud(user);
  }

  /**
   * Método que retorna várias informações da entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: GetManyDefaultResponseUserProxy })
  public async getMany(@User() requestUser: UserEntity, @ParsedRequest() crudRequest: CrudRequest): Promise<GetManyDefaultResponseUserProxy> {
    return await this.service.listMany(requestUser, crudRequest).then(response => mapCrud(response));
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public async getOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @ParsedRequest() crudRequest: CrudRequest): Promise<UserProxy> {
    return await this.service.get(requestUser, +entityId, crudRequest).then(response => mapCrud(response));
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
    return this.service.create(requestUser, payload).then(response => mapCrud(response));
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public async replaceOne(@User() requestUser: UserEntity, @Param('id') entityId: number, @Body() payload: UpdateUserPayload): Promise<UserProxy> {
    return await this.service.update(requestUser, +entityId, payload).then(response => mapCrud(response));
  }

  //#endregion

}
