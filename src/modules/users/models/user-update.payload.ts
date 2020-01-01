//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { CrudValidationGroups } from '@nestjsx/crud';
const { UPDATE } = CrudValidationGroups;

import { UserEntity } from '../../../typeorm/entities/user.entity';

//#endregion

export class UserUpdatePayload {

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

}
