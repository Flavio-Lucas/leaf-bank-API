//#region Imports

import {BaseCrudProxy} from '../../../common/base-crud.proxy';
import {ApiProperty} from '@nestjs/swagger';

//#endregion

/**
 * A classe que representa as informações sobre uma tentativa de resetar a senha
 */
export class ForgotPasswordProxy {

    //#region Constructor

    /**
     * Construtor padrão
     */
    constructor(
        isEmailSent: boolean,
        expiresAt: number,
    ) {
        this.isEmailSent = isEmailSent;
        this.expiresAt = new Date(expiresAt);

    }

    /**
     * Diz se o e-mail foi enviado
     */
    @ApiProperty()
    isEmailSent: boolean;

    /**
     * Diz até quando o e-mail é válido
     */
    @ApiProperty()
    expiresAt: Date;

    //#endregion

}
