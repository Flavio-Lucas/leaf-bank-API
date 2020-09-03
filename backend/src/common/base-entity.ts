//#region Imports

import { ApiPropertyOptional } from '@nestjs/swagger';

import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';

import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

const { CREATE, UPDATE } = CrudValidationGroups;

//#endregion

/**
 * A classe base para as entidades
 */
export class BaseEntity {

  /**
   * A identificação do post
   */
  @ApiPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Diz quando foi criado essa postagem
   */
  @ApiPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Diz quando foi atualizado essa postagem
   */
  @ApiPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Diz se está ativo
   */
  @ApiPropertyOptional()
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Column({ default: true })
  isActive: boolean;

}
