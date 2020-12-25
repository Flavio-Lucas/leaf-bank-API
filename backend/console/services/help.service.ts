//#region Imports

import { Command, Console } from 'nestjs-console';
import * as printMessage from 'print-message';
import * as prompts from 'prompts';

//#endregion

/**
 * O serviço que lida com alguns feedbacks de ajuda
 */
@Console()
export class HelpService {

  //#region CLI Methods

  /**
   * Método que realiza algumas perguntas para ajudar o desenvolvedor a resolver um problema
   */
  @Command({
    command: 'help',
    alias: 'h',
    description: 'Getting some assistance.',
  })
  public async getHelp(): Promise<void> {
    const { alreadyReadTheError } = await prompts({
      type: 'toggle',
      name: 'alreadyReadTheError',
      message: 'Você já leu o erro?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadyReadTheError)
      return this.printErrorMessage('Então vá ler a porra do erro, não sou bola de cristal!');

    const { alreadyReadTheErrorTwice } = await prompts({
      type: 'toggle',
      name: 'alreadyReadTheErrorTwice',
      message: 'Leu mais de uma vez?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadyReadTheErrorTwice)
      return this.printErrorMessage('Então vá ler de novo carai!', 'Tu nunca consegue descobrir nada lendo uma vez só!');

    const { alreadyReadCorrectTheError } = await prompts({
      type: 'toggle',
      name: 'alreadyReadCorrectTheError',
      message: 'Tem certeza que tá lendo a primeira mensagem de erro? Se tu só leu o último erro do NPM, tu está começando errado.',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadyReadCorrectTheError)
      return this.printErrorMessage('Então suba lá e leia a bendita mensagem!');

    const { alreadySearchOnGoogle } = await prompts({
      type: 'toggle',
      name: 'alreadySearchOnGoogle',
      message: 'Agora que eu sei que você sabe ler, tu já pesquisou isso no Google?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadySearchOnGoogle)
      return this.printWarningMessage('Tá esperando o que meu parceiro?', 'Pesquisa lá o erro caraí!', '', 'https://google.com');

    const { alreadySearchCorrectOnGoogle } = await prompts({
      type: 'toggle',
      name: 'alreadySearchCorrectOnGoogle',
      message: 'Mas pesquisou de forma certa, "<mensagem de erro> <framework>"?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadySearchCorrectOnGoogle)
      return this.printWarningMessage('Então volte uma casa e', 'tente novamente!', '', 'https://google.com');

    const { countOfOpenedLinks } = await prompts({
      type: 'select',
      name: 'countOfOpenedLinks',
      message: 'E quantos links tu abriu?',
      initial: 0,
      choices: [
        { title: '0', value: 0 },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
        { title: '3', value: 3 },
        { title: '4', value: 4 },
        { title: '5+', value: 5 },
      ],
    });

    if (countOfOpenedLinks === 0)
      return this.printErrorMessage('Se eu pudesse ver essa resposta pessoalmente', 'eu estaria te espancando nesse momento.', '', 'Porra mano, volta lá e abre os links, tá achando que sou mago?!');

    if (countOfOpenedLinks < 5)
      return this.printWarningMessage('Hm... muitos poucos links, vá lá e abra mais alguns!', 'E leia né, em vez de só bater o olho e desistir.');

    const { correctReadAnswers } = await prompts({
      type: 'toggle',
      name: 'correctReadAnswers',
      message: 'Tá desesperado eim... Ok, mas tu entendeu o problema e as respostas fornecidas? Tipo, leu mesmo e não só bateu o olho?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!correctReadAnswers)
      return this.printWarningMessage('Então volta lá e leia tudo,', 'como tu acha que vai descobrir a resposta', 'se tu nem mesmo lê toda a resposta/pergunta?');

    const { alreadyEraseDist } = await prompts({
      type: 'toggle',
      name: 'alreadyEraseDist',
      message: 'Tu já apagou a dist?',
      initial: false,
      active: 'sim',
      inactive: 'não',
    });

    if (!alreadyEraseDist)
      return this.printWarningMessage('Tenta lá ué', 'Vai que seja isso...');

    const { selectedHelpOption } = await prompts({
      type: 'toggle',
      name: 'selectedHelpOption',
      message: 'E aí, agora que tu apagou a dist, o que tu quer fazer?',
      initial: false,
      active: 'pedir ajuda',
      inactive: 'chorar',
    });

    if (!selectedHelpOption)
      return this.printInfoMessage('https://open.spotify.com/track/2P8SAkKyFWZfTVCe9m1mBQ?si=SLz_I6lQRdGkqgk9Pofe4Q');

    this.printSuccessMessage('How To Perguntar a Alguém', '', 'Responda as perguntas abaixo:');
    const response = await prompts([
      {
        type: 'text',
        message: 'O que você que fazer, não o que você está fazendo, o que você realmente quer fazer?',
        name: 'what',
      },
      {
        type: 'text',
        message: 'Qual é o erro que está acontecendo?',
        name: 'error',
      },
      {
        type: 'text',
        message: 'Porque você acha que deveria estar funcionando?',
        name: 'why',
      },
      {
        type: 'text',
        message: 'O que tanto você já tentou fazer para corrigir?',
        name: 'tries',
      },
      {
        type: 'text',
        message: 'O que você acha que pode ser?',
        name: 'hint',
      },
      {
        type: 'text',
        message: 'Coloque aqui um link que tu usou para tentar resolver o problema: ',
        name: 'link',
      },
    ]);

    this.printSuccessMessage(
      `Salve mano, eu estou tentando fazer isso aqui: ${ response.what },`,
      `só que está rolando esse erro: ${ response.error },`,
      `eu acho que deveria estar funcionando porque: ${ response.why },`,
      `eu já tentei fazer o seguinte: ${ response.tries },`,
      `eu acho que pode ser isso aqui: ${ response.hint },`,
      `e eu tentei seguir a solução desse link aqui: ${ response.link },`,
      `consegue ter ideia do que pode ser?`,
    );
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que exibe uma mensagem de erro no console
   *
   * @param messages As mensagens de erro
   */
  private printErrorMessage(...messages: string[]): void {
    printMessage(messages, {
      border: true,
      color: 'red',
      borderColor: 'red',
      paddingTop: 1,
      paddingBottom: 1,
    });
  }

  /**
   * Método que exibe uma mensagem de warning no console
   *
   * @param messages As mensagens de warning
   */
  private printWarningMessage(...messages: string[]): void {
    printMessage(messages, {
      border: true,
      color: 'yellow',
      borderColor: 'yellow',
      paddingTop: 1,
      paddingBottom: 1,
    });
  }

  /**
   * Método que exibe uma mensagem de info no console
   *
   * @param messages As mensagens de info
   */
  private printInfoMessage(...messages: string[]): void {
    printMessage(messages, {
      border: true,
      color: 'blue',
      borderColor: 'blue',
      paddingTop: 1,
      paddingBottom: 1,
    });
  }

  /**
   * Método que exibe uma mensagem de success no console
   *
   * @param messages As mensagens de success
   */
  private printSuccessMessage(...messages: string[]): void {
    printMessage(messages, {
      border: true,
      color: 'green',
      borderColor: 'green',
      paddingTop: 1,
      paddingBottom: 1,
    });
  }

  //#endregion

}
