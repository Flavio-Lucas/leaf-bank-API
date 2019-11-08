//#region Imports

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from '../../typeorm/entities/user.entity';

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
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user)
      throw new NotFoundException('O usuário não existe ou foi deletado.');

    return user;
  }

  /**
   * Método que valida um usuário pelo nome e senha
   *
   * @param username A identificação do usuário ( email )
   * @param pass A senha do usuário
   */
  public async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  //#endregion

}
