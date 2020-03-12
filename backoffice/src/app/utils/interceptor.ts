//#region Imports

import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

//#endregion

//#region Class

/**
 * Serviço que intercepta todas as requisições e adiciona novos headers
 */
@Injectable()
export class Interceptor implements HttpInterceptor {

  //#region Methods

  /**
   * Método que intercepta a requisição
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }

  //#endregion

}

//#endregion
