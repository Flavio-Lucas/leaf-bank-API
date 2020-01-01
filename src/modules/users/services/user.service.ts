//#region Imports

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import * as xss from 'xss';

import { Repository } from 'typeorm';
import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';

import { UserEntity } from '../../../typeorm/entities/user.entity';

//#endregion

/**
 * A classe que representa o serviço que lida com os usuários
 */
@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    @InjectRepository(UserEntity) public userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna um usuário pelo e-mail dele
   *
   * @param email O e-mail do usuário
   */
  public async findByEmail(email: string): Promise<UserEntity> {
    const cleanedEmail = xss.filterXSS(email.trim().toLocaleLowerCase());
    const fields: Array<Exclude<keyof UserEntity, 'password'>> = ['id', 'email', 'roles', 'createdAt', 'updatedAt', 'isActive'];
    const user = await this.userRepository.findOne({ select: fields, where: { email: cleanedEmail, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que encontra um usuário para a validação de autenticação
   *
   * @param email O e-mail do usuário
   */
  public async findByEmailForAuth(email: string): Promise<Partial<UserEntity>> {
    const cleanedEmail = xss.filterXSS(email.trim().toLocaleLowerCase());
    const fields: Partial<Array<keyof UserEntity>> = ['id', 'email', 'password', 'roles', 'updatedAt', 'isActive'];

    const user = await this.userRepository.findOne({ select: fields, where: { email: cleanedEmail, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que retorna um usuário baseado no seu id
   *
   * @param id A identificação do usuário
   */
  public async findById(id: number): Promise<UserEntity> {
    const fields: Array<Exclude<keyof UserEntity, 'password'>> = ['id', 'email', 'roles', 'createdAt', 'updatedAt', 'isActive'];
    const user = await this.userRepository.findOne({ select: fields, where: { id, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  //#endregion

}
