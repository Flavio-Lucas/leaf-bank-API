//#region Imports

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import * as xss from 'xss';

import { Repository } from 'typeorm';

import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { VerifyProxy } from '../../../models/proxys/verify.proxy';
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
    @InjectRepository(UserEntity) public repository: Repository<UserEntity>,
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
   * Método que retorna um usuário pelo e-mail dele
   *
   * @param email O e-mail do usuário
   */
  public async findByEmail(email: string): Promise<UserEntity> {
    const cleanedEmail = this.getCleanedEmail(email);
    const user = await this.repository.findOne({ where: { email: cleanedEmail, isActive: TypeOrmValueTypes.TRUE } });

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
    const cleanedEmail = this.getCleanedEmail(email);
    const user = await this.repository.findOne({ where: { email: cleanedEmail, isActive: TypeOrmValueTypes.TRUE } });

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
    const user = await this.repository.findOne({ where: { id, isActive: TypeOrmValueTypes.TRUE } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que retorna as informações do usuário pelo e-mail e ID Token do Facebook
   *
   * @param email O endereço de e-mail do usuário
   * @param facebookIdToken O token de autenticação
   */
  public async findByEmailAndFacebookIdToken(email: string, facebookIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = this.getCleanedEmail(email);

    return await this.repository.findOne({
      where: {
        email: cleanedEmail,
        facebookIdToken,
        isActive: TypeOrmValueTypes.TRUE,
      },
    });
  }

  /**
   * Método que retorna as informações do usuário pelo e-mail e ID Token do Google
   *
   * @param email O endereço de e-mail do usuário
   * @param googleIdToken O token de autenticação
   */
  public async findByEmailAndGoogleIdToken(email: string, googleIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = this.getCleanedEmail(email);

    return await this.repository.findOne({
      where: {
        email: cleanedEmail,
        googleIdToken,
        isActive: TypeOrmValueTypes.TRUE,
      },
    });
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que limpa o e-mail de qualquer ataque ou problema
   *
   * @param email O endereço de e-mail
   */
  private getCleanedEmail(email: string): string {
    return xss.filterXSS(email.trim().toLocaleLowerCase());
  }

  //#endregion

}
