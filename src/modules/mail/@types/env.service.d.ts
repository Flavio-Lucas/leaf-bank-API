declare namespace dotenv {
  interface IDotEnv {

    /**
     * As credencias para enviar e-mails
     */
    EMAIL_TRANSPORT: string;

    /**
     * O e-mail usado para enviar os outros e-mails
     */
    EMAIL_FROM: string;

  }
}
