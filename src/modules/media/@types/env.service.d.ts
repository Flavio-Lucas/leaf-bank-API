declare namespace dotenv {
  interface IDotEnv {

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

    /**
     * O tamanho máximo aceito ao realizar o upload de arquivos
     */
    MAX_UPLOAD_FILE_SIZE: number;

  }
}
