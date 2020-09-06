//#region Imports

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { Column, Entity } from 'typeorm';

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
   * A senha do usuário
   */
  @ApiProperty()
  @Column({ nullable: false })
  public password: string;

  /**
   * O token de identificação do Google
   */
  @ApiPropertyOptional()
  @Column({ nullable: true, unique: true })
  public googleIdToken: string;

  /**
   * O token de identificação do Facebook
   */
  @ApiPropertyOptional()
  @Column({ nullable: true, unique: true })
  public facebookIdToken: string;

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
  public toProxy(isActive?: boolean, user?: string): UserProxy {
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

    return await this.findOne({ where: { email, ...whereOptions } });
  }

  /**
   * Método que retorna as informações do usuário pelo e-mail e ID Token do Facebook
   *
   * @param email O endereço de e-mail do usuário
   * @param facebookIdToken O token de autenticação
   */
  public static async findByEmailAndFacebookIdToken(email: string, facebookIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = getCleanedEmail(email);

    return await this.findOne({
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
  public static async findByEmailAndGoogleIdToken(email: string, googleIdToken: string): Promise<UserEntity | undefined> {
    const cleanedEmail = getCleanedEmail(email);

    return await this.findOne({
      where: {
        email: cleanedEmail,
        googleIdToken,
        isActive: TypeOrmValueTypes.TRUE,
      },
    });
  }

  //#endregion

}
