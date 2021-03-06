//#region Imports

import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { Column, Entity, Not } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';
import { ToProxy } from '../../../common/to-proxy';
import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { getCleanedEmail } from '../../../utils/xss';
import { UserProxy } from '../models/user.proxy';

//#endregion

/**
 * A classe que representa a entidade que lida com os usuários
 */
@Entity('users')
export class UserEntity extends BaseEntity implements ToProxy<UserProxy> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(partial: Partial<UserEntity>) {
    super();

    Object.assign(this, partial);
  }

  //#endregion

  //#region Public Properties

  /**
   * O e-mail do usuário
   */
  @ApiProperty()
  @Column({ nullable: false, unique: true })
  public email: string;

  /**
   * O e-mail do usuário
   */
  @ApiProperty()
  @Column({ nullable: false })
  public name: string;

  /**
   * O e-mail do usuário
   */
  @ApiProperty()
  @Column({ nullable: false, type: 'float' })
  public leafs: number;

  /**
   * A senha do usuário
   */
  @ApiProperty()
  @Column({ nullable: false })
  public password: string;

  /**
   * As permissões desse usuário
   */
  @Exclude()
  @Column({ nullable: false })
  public roles: string;

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna um proxy da entidade
   */
  public toProxy(): UserProxy {
    return new UserProxy(this);
  }

  //#endregion

  //#region Public Static Methods

  /**
   * Método que retorna um usuário pelo e-mail
   *
   * @param email O e-mail usado para procurar o usuário
   * @param validateIsActive Diz se deve validar se ele está ativo
   */
  public static async getByEmail(email: string, validateIsActive: boolean = true): Promise<UserEntity | undefined> {
    const whereOptions = validateIsActive ? { isActive: TypeOrmValueTypes.TRUE } : {};

    email = getCleanedEmail(email);

    const user = await this.findOne<UserEntity>({ where: { email, ...whereOptions } });

    if (!user)
      throw new NotFoundException('O usuário com o e-mail informado não existe ou foi desativado.');

    return user;
  }

  /**
   * Método que diz se já existe um usuário com aquele e-mail especifico
   *
   * @param email O e-mail usado para procurar o usuário
   * @param ignoreUserId Diz para ignorar um usuário em específico
   */
  public static async hasUserWithEmail(email: string, ignoreUserId: number = -1): Promise<boolean> {
    email = getCleanedEmail(email);

    return await this.count({ where: { email, id: Not(ignoreUserId) } }).then(count => count > 0);
  }

  //#endregion

}
