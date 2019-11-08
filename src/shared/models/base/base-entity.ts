//#region Imports

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

//#endregion

/**
 * A classe base para as entidades
 */
export class BaseEntity {

  /**
   * A identificação do post
   */
  @ApiModelPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Diz quando foi criado essa postagem
   */
  @ApiModelPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Diz quando foi atualizado essa postagem
   */
  @ApiModelPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Diz se está ativo
   */
  @ApiModelPropertyOptional({ default: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ default: true })
  isActive: boolean;

}
