//#region Imports

import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

import { Repository } from 'typeorm';

import { BaseCrudService } from '../../../common/base-crud.service';
import { isAdminUser, isValid } from '../../../utils/functions';
import { encryptPassword } from '../../../utils/password';
import { getCleanedEmail } from '../../../utils/xss';
import { RolesEnum } from '../../auth/models/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { CreateUserPayload } from '../models/create-user.payload';
import { UpdateUserPayload } from '../models/update-user.payload';

//#endregion

/**
 * A classe que representa o serviço que lida com os usuários
 */
@Injectable()
export class UserService extends BaseCrudService<UserEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectRepository(UserEntity)
    public repository: Repository<UserEntity>,
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
  public async listMany(requestUser: UserEntity, crudRequest: CrudRequest): Promise<GetManyDefaultResponse<UserEntity> | UserEntity[]> {
    if (isAdminUser(requestUser))
      return await this.getMany(crudRequest);

    throw new ForbiddenException('Você não tem permissão para listar todos os usuários.');
  }

  /**
   * Método que retorna as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param crudRequest As informações da requisição do CRUD
   */
  public async get(requestUser: UserEntity, entityId: number, crudRequest?: CrudRequest): Promise<UserEntity> {
    let entity: UserEntity;

    if (crudRequest)
      entity = await super.getOne(crudRequest);
    else
      entity = await UserEntity.findById(entityId);

    if (!entity)
      throw new NotFoundException(`A entidade procurada pela identificação (${ entityId }) não foi encontrada.`);

    if (entityId === requestUser.id)
      return entity;

    if (isAdminUser(requestUser))
      return entity;

    throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');
  }

  /**
   * Método que cria uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param payload As informações para a criação
   */
  public async create(requestUser: UserEntity, payload: CreateUserPayload): Promise<UserEntity> {
    const entity = this.getEntityFromPayload(payload);

    const alreadyHasUser = await UserEntity.hasUserWithEmail(payload.email);

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    const validPermissions: string[] = [RolesEnum.USER];

    if (isAdminUser(requestUser) && isValid(payload.roles) && payload.roles.split('|').every(role => validPermissions.includes(role)))
      entity.roles = payload.roles;

    if (!entity.password)
      throw new BadRequestException('Não foi enviada uma senha, por favor, confirme se você está enviando e processando corretamente a senha.');

    entity.password = await encryptPassword(entity.password);
    entity.roles = entity.roles || RolesEnum.USER;

    return await entity.save();
  }

  /**
   * Método que atualiza as informações de uma entidade
   *
   * @param requestUser As informações do usuário que faz a requisição
   * @param entityId A identificação da entidade que está sendo procurada
   * @param payload As informações para a atualização da entidade
   */
  public async update(requestUser: UserEntity, entityId: number, payload: UpdateUserPayload): Promise<UserEntity> {
    const canSeeDeleted = isAdminUser(requestUser);
    const oldUser = await UserEntity.findById<UserEntity>(entityId, !canSeeDeleted);

    if (isAdminUser(oldUser) && oldUser.id !== requestUser.id)
      throw new ForbiddenException('Você não tem permissão de atualizar as informações de outro administrador.');

    const userToUpdate = this.getEntityFromPayload(payload, entityId);
    const validPermissions: string[] = [RolesEnum.USER];

    if (isAdminUser(requestUser) && isValid(payload.roles) && payload.roles.split('|').every(role => validPermissions.includes(role)))
      userToUpdate.roles = payload.roles;

    const alreadyHasUser = await UserEntity.hasUserWithEmail(payload.email, entityId);

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    if (entityId === requestUser.id)
      return await userToUpdate.save();

    if (isAdminUser(requestUser))
      return await userToUpdate.save();

    throw new UnauthorizedException('Você não tem permissão para realizar essa operação.');
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que retorna a entidade a partir de um payload
   *
   * @param payload As informações do payload
   * @param id A identificação do usuário
   */
  private getEntityFromPayload(payload: CreateUserPayload | UpdateUserPayload, id?: number): UserEntity {
    return new UserEntity({
      ...isValid(id) && { id },
      ...isValid(payload.email) && { email: getCleanedEmail(payload.email) },
      ...isValid(payload.leafs) && { leafs: payload.leafs },
      ...isValid(payload.name) && { name: payload.name },
      
      ...payload instanceof UpdateUserPayload && isValid(payload.isActive) && { isActive: payload.isActive },
      ...payload instanceof CreateUserPayload && isValid(payload.password) && { password: payload.password },
    });
  }

  //#endregion

}
