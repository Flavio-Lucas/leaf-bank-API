//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChildEntity, Column } from 'typeorm';

import { TypeOrmValueTypes } from '../../../models/enums/type-orm-value.types';
import { getCleanedEmail } from '../../../utils/xss';
import { UserEntity } from '../../users/entities/user.entity';

//#endregion

/**
 * A class que representa a entidade que lida com as informações de um usuário do Facebook
 */
@ChildEntity()
export class FacebookEntity extends UserEntity {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    partial: Partial<FacebookEntity> | FacebookEntity,
  ) {
    super(partial);

    Object.assign(this, { ...partial });
  }

  //#endregion

  //#region Public Properties

  /**
   * O token de identificação do Facebook
   */
  @ApiPropertyOptional()
  @Column({ nullable: true, unique: true })
  public facebookIdToken: string;

  //#endregion

  //#region Public Static Methods

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

  //#endregion

}
