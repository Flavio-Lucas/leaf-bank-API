//#region Imports

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { isAdmin } from '../../utils/functions';
import { JqueryHelper } from '../../utils/jquery';
import { Keys } from '../../utils/keys';

//#endregion

@Injectable({ providedIn: 'root' })
export class AuthenticateGuard implements CanActivate {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
  ) { }

  //#endregion

  /**
   * Método que diz se deve ativar a rota ou não
   */
  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { redirectIfAuthenticated, redirectIfNotAuthenticated, routeToRedirect } = route.data;
    const token = localStorage.getItem(Keys.TOKEN);

    const hasToken = token !== null;
    const shouldRedirectIfNotAuthenticated = !hasToken && redirectIfNotAuthenticated && !redirectIfAuthenticated;
    const shouldRedirectIfAuthenticated = hasToken && redirectIfAuthenticated && !redirectIfNotAuthenticated;

    if (state.url === '/login' && !hasToken)
      return true;

    const notHavePermissions = async () => {
      JqueryHelper.error('Você não possui permissões para acessar essa página.');

      await this.router.navigate(['login']);

      localStorage.removeItem(Keys.TOKEN);

      return false;
    };

    if (!isAdmin(token))
      return await notHavePermissions();

    if (shouldRedirectIfAuthenticated || shouldRedirectIfNotAuthenticated)
      return await this.router.navigateByUrl(routeToRedirect) || void 0;

    return true;
  }
}
