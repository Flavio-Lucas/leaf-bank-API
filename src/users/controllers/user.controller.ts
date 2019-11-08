//#region Imports

import { ClassSerializerInterceptor, Controller, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { CreateManyDto, Crud, CrudRequest, GetManyDefaultResponse, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { BaseCrudController } from '../../shared/controllers/base-crud.controller';
import { ProtectTo } from '../../shared/decorators/protect/protect.decorator';
import { UserEntity } from '../../typeorm/entities/user.entity';
import { NestJSRequest } from '../../shared/utils/type.shared';
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
   * Método que retorna várias informações da entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('admin')
  @Override()
  public getMany(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<GetManyDefaultResponse<UserEntity> | UserEntity[]> {
    return this.base.getManyBase(crudRequest);
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('user', 'admin')
  @Override()
  public getOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<UserEntity> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.getOneBase(crudRequest);
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
  public createMany(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() payload: CreateManyDto<UserEntity>): Promise<UserEntity> {
    return this.base.createManyBase(crudRequest, payload);
  }

  /**
   * Método que cria uma nova entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   * @param dto As informações para a criação da entidade
   */
  @Override()
  public createOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: UserEntity): Promise<UserEntity> {
    return this.base.createOneBase(crudRequest, dto);
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
  public replaceOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: UserEntity): Promise<UserEntity> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.replaceOneBase(crudRequest, dto);
  }

  /**
   * Método que deleta uma entidade
   *
   * @param nestRequest As informações da requisição do NestJS
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('user', 'admin')
  @Override()
  public async deleteOne(@Request() nestRequest: NestJSRequest, @ParsedRequest() crudRequest: CrudRequest): Promise<void | UserEntity> {
    if ((+nestRequest.params.id) !== nestRequest.user.id && !nestRequest.user.roles.includes('admin'))
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');

    return this.base.deleteOneBase(crudRequest);
  }

  //#endregion

}
