//#region Imports

import { HttpService, Injectable } from '@nestjs/common';

import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

import { Subject } from 'rxjs';

//#endregion

//#region Class

/**
 * A classe que representa um serviço responsável por lidar com as chamadas assincronas em um Endpoint
 */
@Injectable()
export class HttpAsyncService {

  //#region Construtor

  /**
   * Construtor padrão
   *
   * @param http Modulo HTTP
   */
  constructor(
    private readonly http: HttpService,
  ) {
    this.onAsyncResultError = new Subject<AxiosError>();
  }

  //#endregion

  //#region Private Properties

  /**
   * O evento emitido ao ocorrer um erro com a requisição
   */
  private readonly onAsyncResultError: Subject<AxiosError>;

  /**
   * O método que realiza validações antes de executar uma requisição
   */
  private beforeValidations: () => Promise<AsyncResult<any>>;

  //#endregion

  //#region Public Methods

  /**
   * Método que seta uma validação a ser executado antes de cada requisição
   */
  public setBeforeValidations(beforeValidation: () => Promise<AsyncResult<any>>): void {
    this.beforeValidations = beforeValidation;
  }

  /**
   * Método que retorna o evento chamado ao ocorrer um erro com a chamada API
   */
  public getOnAsyncResultError(): Subject<AxiosError> {
    return this.onAsyncResultError;
  }

  //#endregion

  //#region Private Methods

  /**
   * Converte um resultado para AsyncResult para quando der certo
   *
   * @param result O resultado obtido
   */
  private success<T>(result: T): AsyncResult<T> {
    return {
      success: result,
    } as AsyncResult<T>;
  }

  /**
   * Encapsula o erro no AsyncResult
   *
   * @param error O erro enviado pelo servidor
   */
  private error<T>(error: AxiosError<T>): AsyncResult<T> {
    this.onAsyncResultError.next(error);

    return {
      error,
    } as AsyncResult<T>;
  }

  //#endregion

  //#region Async Restfull Methods

  /**
   * Envia uma requisição com o método GET de forma assincrona
   *
   * @param url Url para a requisição. Obs: Ele já é automaticamente combinado com a url base
   * @param configs As configurações do Axios
   */
  public async get<T>(
    url: string,
    configs?: AxiosRequestConfig,
  ): Promise<AsyncResult<T>> {
    if (this.beforeValidations) {
      const validationResult = await this.beforeValidations();

      if (validationResult.error !== undefined)
        return this.error<T>(validationResult.error);
    }

    return await this.http.get<T>(url, configs).toPromise()
      .then((data: AxiosResponse<T>) => {
        return this.success(data.data);
      })
      .catch((error: AxiosError<T>) => {
        return this.error<T>(error);
      })
      .then<AsyncResult<T>>((result: AsyncResult<T>) => {
        return result;
      });
  }

  /**
   * Envia uma requisição com o método POST
   *
   * @param url Url para a requisição. Obs: Ele já é automaticamente combinado com a url base
   * @param payload Informações a serem enviadas para o servidor
   * @param configs As configurações do Axios
   */
  public async post<T>(
    url: string,
    payload: object,
    configs?: AxiosRequestConfig,
  ): Promise<AsyncResult<T>> {
    if (this.beforeValidations) {
      const validationResult = await this.beforeValidations();

      if (validationResult.error !== undefined)
        return this.error<T>(validationResult.error);
    }

    return await this.http.post<T>(url, payload, configs).toPromise()
      .then((data: AxiosResponse<T>) => {
        return this.success(data.data);
      })
      .catch((error: AxiosError<T>) => {
        return this.error<T>(error);
      })
      .then<AsyncResult<T>>((result: AsyncResult<T>) => {
        return result;
      });
  }

  /**
   * Envia uma requisição com o método PUT
   *
   * @param url Url para a requisição. Obs: Ele já é automaticamente combinado com a url base
   * @param payload Informações a serem enviadas para o servidor
   * @param configs As configurações do Axios
   */
  public async put<T>(
    url: string,
    payload: object,
    configs?: AxiosRequestConfig,
  ): Promise<AsyncResult<T>> {
    if (this.beforeValidations) {
      const validationResult = await this.beforeValidations();

      if (validationResult.error !== undefined)
        return this.error<T>(validationResult.error);
    }

    return await this.http.put<T>(url, payload, configs).toPromise()
      .then((data: AxiosResponse<T>) => {
        return this.success(data.data);
      })
      .catch((error: AxiosError) => {
        return this.error<T>(error);
      })
      .then<AsyncResult<T>>((result: AsyncResult<T>) => {
        return result;
      });
  }

  /**
   * Envia uma requisição com o método DELETE
   *
   * @param url Url para a requisição. Obs: Ele já é automaticamente combinado com a url base
   * @param configs As configurações do Axios
   */
  public async delete<T>(
    url: string,
    configs?: AxiosRequestConfig,
  ): Promise<AsyncResult<T>> {
    if (this.beforeValidations) {
      const validationResult = await this.beforeValidations();

      if (validationResult.error !== undefined)
        return this.error<T>(validationResult.error);
    }

    return await this.http.delete<T>(url, configs).toPromise()
      .then((data: AxiosResponse<T>) => {
        return this.success(data);
      })
      .catch((error: AxiosError) => {
        return this.error<T>(error);
      })
      .then<AsyncResult<T>>((result: AsyncResult<T>) => {
        return result;
      });
  }

  /**
   * Método que busca pelo método GET algum objeto BLOB
   *
   * @param url O url a ser buscado
   * @param configs As configurações do Axios
   */
  public async getBlob(
    url: string,
    configs?: AxiosRequestConfig,
  ): Promise<AsyncResult<ArrayBuffer>> {
    if (this.beforeValidations) {
      const validationResult = await this.beforeValidations();

      if (validationResult.error !== undefined)
        return this.error<ArrayBuffer>(validationResult.error);
    }

    return await this.http.get<ArrayBuffer>(url, { responseType: 'blob', ...configs }).toPromise()
      .then((data: AxiosResponse<ArrayBuffer>) => {
        return this.success(data.data);
      })
      .catch((error: AxiosError) => {
        return this.error<ArrayBuffer>(error);
      })
      .then<AsyncResult<ArrayBuffer>>((result: AsyncResult<ArrayBuffer>) => {
        return result;
      });
  }

  //#endregion

}

//#endregion

//#region Interfaces

/**
 * A interface que representa um resultado obtido de forma assincrona
 */
export interface AsyncResult<T> {

  /**
   * O resultado quando ocorre tudo certo
   */
  success?: T;

  /**
   * O resultado quando dá algum problema
   */
  error?: AxiosError<T>;

}

//#endregion
