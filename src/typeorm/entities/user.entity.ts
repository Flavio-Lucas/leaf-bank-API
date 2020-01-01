//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { IsDefined, IsEmail, IsOptional, IsString, ValidationOptions } from 'class-validator';

import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../models/base/base-entity';
import { DefaultValidationMessages } from '../../models/enums/default-validation-messages';

import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

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

  //#region Static Properties

  /**
   * As opções de validação do email para ver se está definido para o decorador IsDefined
   */
  public static readonly EmailIsDefinedValidationOptions: ValidationOptions = { message: 'É necessário enviar o e-mail.', groups: [CREATE] };

    /**
   * As opções de validação do email para ver se é string para o decorador IsString
   */
  public static readonly EmailIsStringValidationOptions: ValidationOptions = { message: DefaultValidationMessages.IsString, always: true };

  /**
   * As opções de validação do email para ver se é um e-mail do decorador IsEmail
   */
  public static readonly EmailIsEmailValidationOptions: ValidationOptions = { message: DefaultValidationMessages.IsEmail, always: true };

  /**
   * As opções de validação da senha para ver se a senha está definida do decorador IsString
   */
  public static readonly PasswordIsDefinedValidationOptions: ValidationOptions = { message: 'É necessário enviar a senha.', groups: [CREATE] };

  /**
   * As opções de validação da senha para ver se é uma string do decorador IsString
   */
  public static readonly PasswordIsStringValidationOptions: ValidationOptions = { message: DefaultValidationMessages.IsString, always: true };

  //#endregion

  //#region Public Properties

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsDefined(UserEntity.EmailIsDefinedValidationOptions)
  @IsString(UserEntity.EmailIsStringValidationOptions)
  @IsEmail({}, UserEntity.EmailIsEmailValidationOptions)
  @Column({ nullable: false, unique: true })
  public email: string;

  /**
   * A senha do usuário
   */
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsDefined(UserEntity.PasswordIsDefinedValidationOptions)
  @IsString(UserEntity.PasswordIsStringValidationOptions)
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
