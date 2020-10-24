declare namespace dotenv {
  interface IDotEnv {

    /**
     * O máximo de timeout de uma requisição
     */
    HTTP_TIMEOUT: number;

    /**
     * O máximo de redirecionamento de uma requisição
     */
    HTTP_MAX_REDIRECTS: number;

    /**
     * O url base para realizar as requisições HTTP
     */
    HTTP_BASE_URL: string;

  }
}
