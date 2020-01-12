//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../models/base/base-entity';


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
   * As permissões desse usuário
   */
  @Exclude()
  @Column({ nullable: false })
  public roles: string;

  //#endregion

}
