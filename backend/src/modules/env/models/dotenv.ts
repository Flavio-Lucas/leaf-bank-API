/**
 * A interface que representa as configurações necessárias do
 */
export interface IDotEnv {

  //#region Environment

  /**
   * O tipo de ambiente que está rodando a aplicação
   */
  NODE_ENV: string;

  //#endregion

  //#region Database

  /**
   * O tipo de banco de dados suportado
   */
  DB_TYPE: string;

  /**
   * O host para se conectar ao banco de dados
   */
  DB_HOST: string;

  /**
   * O url da conexão ao banco de dados
   */
  DATABASE_URL: string;

  /**
   * A porta para se conectar ao banco de dados
   */
  DB_PORT: number;

  /**
   * O usuário para se conectar ao banco de dados
   */
  DB_USER: string;

  /**
   * A senha para se conectar ao banco de dados
   */
  DB_PASSWORD: string;

  /**
   * O nonem do banco de dados
   */
  DB_DATABASE: string;

  /**
   * Diz se deve sincronizar o banco de dados automaticamente após uma mudança.
   *
   * @note Não deixar TRUE em produção, há um risco de perder dados.
   */
  DB_SYNCHRONIZE: boolean;

  /**
   * Diz se deve rodar as migrations ao executar a API
   */
  DB_MIGRATIONS_RUN: boolean;

  /**
   * O tempo de timeout em milisegundos para uma conexão com o banco de dados.
   */
  DB_TIMEOUT: number;

  /**
   * Diz se deve habilitar os logs
   */
  DB_LOGGING: boolean;

  /**
   * Diz se deve habilitar habilitar a conexão SSL
   */
  DB_SSL: boolean;

  //#endregion

  //#region API

  /**
   * A estratégia padrão de autenticação
   */
  API_DEFAULT_STRATEGY: string;

  /**
   * O url base para acessar a API.
   * Eu recomendo usar subdominios, e manter o base como ''.
   */
  API_BASE_PATH: string;

  /**
   * Diz se deve habilitar o log da aplicação
   */
  API_ENABLE_LOGGING: boolean;

  /**
   * A janela em milisegundos para a validação do Rate Limiting
   */
  API_RATE_LIMIT_WINDOW_MS: number;

  /**
   * A quantidade de requisições que pode fazer em uma janela de tempo
   */
  API_RATE_LIMIT_MAX: number;

  /**
   * Método que coloca um timeout para as requisições
   */
  API_TIMEOUT: number;

  /**
   * O número da porta que será executado a API
   */
  PORT: number;

  //#endregion

  //#region Crud Options

  /**
   * O limite padrão de itens que podem ser buscados por vez
   */
  CRUD_LIMIT: number;

  /**
   * O limite de itens máximo que pode ser aplicado
   */
  CRUD_MAX_LIMIT: number;

  /**
   * O limite de itens máximo que podem serem cacheados
   */
  CRUD_CACHE: number;

  /**
   * Diz se deve sempre paginar os resultados
   */
  CRUD_ALWAYS_PAGINATE: boolean;

  //#endregion

  //#region JWT

  /**
   * A chave secreta do JWT
   */
  JWT_SECRET_KEY: string;

  /**
   * Diz quando a chave de autenticação deve expirar
   */
  JWT_EXPIRES_IN: string;

  //#endregion

  //#region Swagger

  /**
   * O titulo que será usado para a API.
   * Normalmente colocado o nome da empresa que contratou o serviço
   */
  SWAGGER_TITLE: string;

  /**
   * Uma breve descrição da API
   */
  SWAGGER_DESCRIPTION: string;

  /**
   * A versão atual da API
   */
  SWAGGER_VERSION: string;

  /**
   * Uma simples tag para o Swagger, pode ser o mesmo do titulo
   */
  SWAGGER_TAG: string;

  /**
   * Diz se o Swagger está ativado
   */
  SWAGGER_ENABLED: boolean;

  /**
   * O url base para o Swagger
   */
  SWAGGER_BASE_PATH: string;

  //#endregion

  //#region OAuth2

  /**
   * O client id para autenticar com o Google
   */
  GOOGLE_CLIENT_ID: string;

  /**
   * O client secret para autenticar com o Google
   */
  GOOGLE_CLIENT_SECRET: string;

  /**
   * O client id para autenticar com o Facebook
   */
  FACEBOOK_CLIENT_ID: string;

  /**
   * O client secret para autenticar com o Facebook
   */
  FACEBOOK_CLIENT_SECRET: string;

  //#endregion

  //#region Monitoring

  /**
   * O DNS da Sentry para enviar as exceções
   */
  SENTRY_DNS: string;

  //#endregion

  //#region Facens

  /**
   * O endpoint da API da Facens
   */
  FACENS_API_ENDPOINT: string;

  /**
   * O usuário de um administrador da Facens
   */
  FACENS_ADMIN_USER: string;

  /**
   * A senha de um usuário administrador da Facens
   */
  FACENS_ADMIN_PASSWORD: string;

  //#endregion

  //#region HTTP Settings

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

  //#endregion

  //#region Azure

  /**
   * A chave de acesso do Storage do Azure
   */
  AZURE_SAS_KEY: string;

  /**
   * O nome da conta do Storage do Azure
   */
  AZURE_ACCOUNT_NAME: string;

  /**
   * O nome do container de Storage do Azure
   */
  AZURE_CONTAINER_NAME: string;

  //#endregion

  //#region Mail

  /**
   * As credencias para enviar e-mails
   */
  EMAIL_TRANSPORT: string;

  /**
   * O e-mail usado para enviar os outros e-mails
   */
  EMAIL_FROM: string;

  //#endregion

  //#region Password Reset

  /**
   * O site para o qual o usuário poderá ir com o código para resetar a senha
   */
  PASSWORD_RESET_WEBSITE: string;

  //#endregion
}
