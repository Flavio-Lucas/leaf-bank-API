//#region Imports

import { ClassSerializerInterceptor, Controller, Get, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import { CreateManyDto, Crud, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { BaseCrudController } from '../../../common/base-crud.controller';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { UserEntity } from '../../../typeorm/entities/user.entity';
import { CrudProxy, mapCrud } from '../../../utils/crud';
import { NestJSRequest } from '../../../utils/type.shared';
import { UserProxy } from '../models/user.proxy';
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
    ],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiUseTags('user')
@Controller('user')
export class UserController extends BaseCrudController<UserEntity, UserService> {

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
   * @param nestRequest As informações da requisição do NestJS
   */
  @Get('me')
  @ApiOkResponse({ description: 'Get info about user logged.', type: UserProxy })
  @ProtectTo('user')
  public async getMe(@Request() nestRequest: NestJSRequest): Promise<CrudProxy<UserProxy>> {
    return mapCrud(UserProxy, nestRequest.user);
  }

  /**
   * Método que retorna várias informações da entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('admin')
  @Override()
  @ApiOkResponse({ type: UserProxy, isArray: true })
  public getMany(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<CrudProxy<UserProxy>> {
    return this.base.getManyBase(crudRequest).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('user', 'admin')
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public getOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<CrudProxy<UserProxy>> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.getOneBase(crudRequest).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que cria várias entidades de uma vez só
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   * @param payload As informações para realizar a operação
   */
  @ProtectTo('admin')
  @Override()
  @ApiOkResponse({ type: UserProxy, isArray: true })
  public createMany(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() payload: CreateManyDto<UserEntity>): Promise<CrudProxy<UserProxy>> {
    return this.base.createManyBase(crudRequest, payload).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   * @param dto As informações para a criação da entidade
   */
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public createOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: UserEntity): Promise<CrudProxy<UserProxy>> {
    return this.base.createOneBase(crudRequest, dto).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que atualiza uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   * @param dto As informações para a atualização da entidade
   */
  @ProtectTo('user', 'admin')
  @Override()
  @ApiOkResponse({ type: UserProxy })
  public replaceOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: UserEntity): Promise<CrudProxy<UserProxy>> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.replaceOneBase(crudRequest, dto).then(response => mapCrud(UserProxy, response));
  }

  /**
   * Método que deleta uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('user', 'admin')
  @Override()
  @ApiOkResponse({ type: undefined })
  public async deleteOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<CrudProxy<UserProxy>> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.deleteOneBase(crudRequest).then(response => response && mapCrud(UserProxy, response) || void 0);
  }

  //#endregion

}
