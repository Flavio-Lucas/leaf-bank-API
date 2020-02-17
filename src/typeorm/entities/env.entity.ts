//#region Imports

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/base-entity';

//#endregion

/**
 * A classe que representa a entidade que guarda as informações de configuração da API
 */
@Entity('envs')
export class EnvEntity extends BaseEntity {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    partial: Partial<EnvEntity>,
  ) {
    super();

    Object.assign(this, { ... partial });
  }

  //#endregion

  /**
   * O chave para acessar esse valor
   */
  @ApiModelProperty()
  @Column({ nullable: false, unique: true })
  key: string;

  /**
   * O valor armazenado nessa chave
   */
  @ApiModelPropertyOptional()
  @Column({ nullable: true, type: 'text' })
  value: string;

}
