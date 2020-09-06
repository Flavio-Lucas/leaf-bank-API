//#region Imports

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';

import * as bcryptjs from 'bcryptjs';

import { Repository } from 'typeorm';

import { v4 } from 'uuid';

import { BaseCrudService } from '../../../common/base-crud.service';
import { isAdminUser, isValid } from '../../../utils/functions';
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

    const alreadyHasUser = await UserEntity.getByEmail(payload.email, false);

    if (alreadyHasUser)
      throw new BadRequestException('Já existe um usuário cadastrado com esse e-mail.');

    if (isAdminUser(requestUser) && isValid(payload.roles))
      entity.roles = payload.roles;

    const salt = await bcryptjs.genSalt();
    const passwordToEncrypt = entity.googleIdToken || entity.facebookIdToken ? v4() : entity.password;

    if (!passwordToEncrypt)
      throw new BadRequestException('Não foi enviada uma senha, por favor, confirme se você está enviando e processando corretamente a senha.');

    entity.password = await bcryptjs.hash(passwordToEncrypt, salt);
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
    const isUserExists = await UserEntity.exists(entityId);

    if (!isUserExists)
      throw new NotFoundException('A entidade procurada não existe.');

    const entity = this.getEntityFromPayload(payload, entityId);

    if (isAdminUser(requestUser) && isValid(payload.roles))
      entity.roles = payload.roles;

    if (entityId === requestUser.id)
      return await entity.save();

    if (isAdminUser(requestUser))
      return await entity.save();

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
      ...isValid(payload.email) && { email: payload.email },
      ...payload instanceof CreateUserPayload && isValid(payload.password) && { password: payload.password },
    });
  }

  //#endregion

}
