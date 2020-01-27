//#region Imports

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/base-entity';


//#endregion

/**
 * A classe que representa a entidade que lida com os usuários
 */
@Entity()
export class UserEntity extends BaseEntity {

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
  @ApiModelProperty()
  @Column({ nullable: false, unique: true })
  public email: string;

  /**
   * A senha do usuário
   */
  @ApiModelProperty()
  @Column({ nullable: false })
  public password: string;

  /**
   * O número de telefone do usuário
   */
  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  public phone: string;

  /**
   * O token de identificação do Google
   */
  @ApiModelPropertyOptional()
  @Column({ nullable: true, unique: true })
  public googleIdToken: string;

  /**
   * O token de identificação do Facebook
   */
  @ApiModelPropertyOptional()
  @Column({ nullable: true, unique: true })
  public facebookIdToken: string;

  /**
   * As permissões desse usuário
   */
  @Exclude()
  @Column({ nullable: false })
  public roles: string;

  //#endregion

}
