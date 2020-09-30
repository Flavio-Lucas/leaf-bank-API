//#region Imports

import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsNotEmpty, MinLength} from 'class-validator';

//#endregion

/**
 * A classe que representa as informações enviadas para o reset da senha
 */
export class ResetPasswordPayload {

    /**
     * A nova senha que o usuário quer colocar
     */
    @ApiProperty()
    @IsDefined({message: 'É necessário enviar a uma nova senha para resetar a sua senha.'})
    @IsNotEmpty({message: 'A nova senha não pode ser vázia.'})
    @MinLength(6, {message: 'É necessário enviar uma senha com 6 ou mais de caracteres.'})
    newPassword: string;

}
