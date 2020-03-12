//#region Imports

import { Strategy } from 'passport-jwt';

//#endregion

/**
 * A classe que representa a estratégia de autenticação anonima
 */
export class AnonymousStrategy extends Strategy {

  /**
   * Método que sobrescreve o comportamento padrão da autenticação por JWT
   * De forma que, ao encontrar um usuário com informações válidas, ele passa o usuário como autenticado.
   * Se não encontrar o Header Authorization, ele vai dar erro, e eu irei lançar como um sucesso mas apenas com as roles de anonymous.
   *
   * @param args Os argumentos da função
   */
  public authenticate(...args: any[]): void {
    super.fail = () => this.success({ roles: 'anonymous' });
    super.error = () => this.success({ roles: 'anonymous' });

    try {
      super.authenticate.apply(this, args);
    } catch (e) {
      this.success({ roles: 'anonymous' });
    }
  }
}
