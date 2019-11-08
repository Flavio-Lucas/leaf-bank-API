//#region Imports

import { ApiModelProperty } from '@nestjs/swagger';

import { IsDefined, IsEmail, IsString } from 'class-validator';

import { removeCrudOptions } from '../../shared/utils/entity.utils';
import { UserEntity } from '../../typeorm/entities/user.entity';

//#endregion

/**
 * A classe que representa o payload enviado para realizar login
 */
export class LoginPayload {

  /**
   * O e-mail do usuário
   */
  @ApiModelProperty()
  @IsDefined(removeCrudOptions(UserEntity.EmailIsDefinedValidationOptions))
  @IsString(removeCrudOptions(UserEntity.EmailIsStringValidationOptions))
  @IsEmail({}, removeCrudOptions(UserEntity.EmailIsEmailValidationOptions))
  username: string;

  /**
   * A senha do usuário
   */
  @ApiModelProperty()
  @IsDefined(removeCrudOptions(UserEntity.PasswordIsDefinedValidationOptions))
  @IsString(removeCrudOptions(UserEntity.PasswordIsStringValidationOptions))
  password: string;

}
