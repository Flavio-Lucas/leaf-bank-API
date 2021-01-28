//#region Imports

import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/base-entity';
import { UserEntity } from '../../users/entities/user.entity';

//#endregion

/**
 * A class que representa a entidade que lida com as informações de resetar a senha de um usuário
 */
@Entity('user_password_resets')
export class UserPasswordResetEntity extends BaseEntity {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    partial: Partial<UserPasswordResetEntity> | UserPasswordResetEntity,
  ) {
    super();

    Object.assign(this, { ...partial });
  }

  //#endregion

  //#region Public Properties

  /**
   * A identificação do usuário
   */
  @Column({ nullable: false })
  public userId: number;

  /**
   * As informações do usuário que quer resetar a senha
   */
  @ManyToOne(() => UserEntity)
  public user: UserEntity;

  /**
   * O código que será usado para resetar a senha
   */
  @Column({ nullable: false })
  public resetPasswordCode: string;

  /**
   * Diz até quando esse código deve ficar válido
   *
   * @note A data será salva em UNIX
   */
  @Column({ type: 'bigint', nullable: false })
  public validUntil: number;

  //#endregion
}
