//#region Imports

import { Keys } from './keys';

//#endregion

//#region Declares

/**
 * JQuery instance
 */
declare const $: any;

//#endregion

/**
 * A classe que representa um helper do JQuery
 */
export class JqueryHelper {

  /**
   * Método que envia uma notificação no canto superior direito
   */
  public static notify(icon: string, message: string, type: 'danger' | 'success'): void {
    $.notify({ icon, message }, { type, template: Keys.NOTIFICATION_TEMPLATE });
  }

  /**
   * Método que envia uma notificação no canto superior direito de erro
   */
  public static error(message: string): void {
    $.notify({ icon: 'add_alert', message }, { type: 'danger', template: Keys.NOTIFICATION_TEMPLATE });
  }

  /**
   * Método que envia uma notificação no canto superior direito de erro
   */
  public static success(message: string): void {
    $.notify({ icon: 'add_alert', message }, { type: 'success', template: Keys.NOTIFICATION_TEMPLATE });
  }

  /**
   * Método que define um estado para o loading
   *
   * @param loadingComponent O componente de loading
   * @param state O estado para o componente
   * @param status O status para quando de erro já exibir uma mensagem de erro
   * @param message A mensagem que será exibido ao terminar as coisas
   */
  public static setLoadingState(loadingComponent: JQuery<HTMLElement>, state: 'show' | 'hidden', status: 'success' | 'danger' = undefined, message: string = undefined): void {
    loadingComponent.css('display', state === 'show' ? 'unset' : 'none');

    if (status === 'success')
      JqueryHelper.success(message);
    else if (status === 'danger')
      JqueryHelper.error(message);
  }

}
