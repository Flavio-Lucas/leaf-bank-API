//#region Imports

import { mkdir, readFile, writeFile } from 'fs';
import { Command, Console, createSpinner } from 'nestjs-console';
import { paramCase } from 'param-case';
import { pascalCase } from 'pascal-case';
import { join } from 'path';
import { plural } from 'pluralize';
import { promisify } from 'util';

//#endregion

/**
 * O serviço que lida com a criação dos templates da API
 */
@Console({
  name: 'generate',
  alias: 'g',
  description: 'Create service/controller/etc based on templates',
})
export class GenerateService {

  //#region CLI Methods

  /**
   * Método que cria uma entidade
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'entity <name>',
    alias: 'e',
    description: 'Create new entity.',
  })
  public async createEntity(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'entities',
      'entity',
      'nest-entity',
      'uma entidade',
    );
  }

  /**
   * Método que cria um controller
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'controller <name>',
    alias: 'c',
    description: 'Create new controller.',
  })
  public async createController(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'controllers',
      'controller',
      'nest-controller',
      'um controller',
    );
  }

  /**
   * Método que cria um serviço
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'service <name>',
    alias: 's',
    description: 'Create new service.',
  })
  public async createService(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'services',
      'service',
      'nest-service',
      'um serviço',
    );
  }

  /**
   * Método que cria um proxy
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'proxy <name>',
    alias: 'p',
    description: 'Create new proxy for a entity.',
  })
  public async createProxy(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'models',
      'proxy',
      'nest-proxy',
      'um proxy',
    );
  }

  /**
   * Método que cria um payload de criação
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'create <name>',
    alias: 'cp',
    description: 'Create new create payload.',
  })
  public async createCreatePayload(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'models',
      'payload',
      'nest-create',
      'um payload',
      'create-',
    );
  }

  /**
   * Método que cria um payload de atualização
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'update <name>',
    alias: 'up',
    description: 'Create new update payload.',
  })
  public async createUpdatePayload(name: string): Promise<void> {
    await this.createTemplate(
      name,
      'models',
      'payload',
      'nest-update',
      'um payload',
      'update-',
    );
  }

  /**
   * Método que cria módulo
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'module <name>',
    alias: 'm',
    description: 'Create new module.',
  })
  public async createModule(name: string): Promise<void> {
    await this.createTemplate(
      name,
      '',
      'module',
      'nest-module',
      'um módulo',
    );
  }

  /**
   * Método que cria um recurso completo de CRUD
   *
   * @param name O nome usado como base
   */
  @Command({
    command: 'resource <name>',
    alias: 'r',
    description: 'Create new crud resource.',
  })
  public async createResource(name: string): Promise<void> {
    await this.createEntity(name);
    await this.createController(name);
    await this.createService(name);
    await this.createProxy(name);
    await this.createCreatePayload(name);
    await this.createUpdatePayload(name);
    await this.createModule(name);
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que realiza a criação de um template
   *
   * @param name O nome base para criar os templates
   * @param folder A pasta usada como base
   * @param extension A extensão do arquivo
   * @param templateName O nome do template usado como base
   * @param prettyName Um nome bonito para exibir na tela descrevendo o que está sendo criado
   * @param prefixFilename O prefixo colocado no nome do arquivo
   */
  private async createTemplate(name: string, folder: string, extension: string, templateName: string, prettyName: string, prefixFilename?: string): Promise<void> {
    const spin = createSpinner();

    const entity = pascalCase(name);
    const pluralEntity = plural(paramCase(entity));
    const fileName = `${ prefixFilename || '' }${ paramCase(name) }.${ extension }.ts`;
    const dirPath = join(__dirname, '../../src/modules', name, folder);
    const filePath = join(dirPath, fileName);

    spin.start();
    spin.info(`Criando ${ prettyName }...`);
    spin.info(`O caminho é: ${ filePath }`);

    try {
      const templateContent = await promisify(readFile)(join(__dirname, '../templates', `${ templateName }.template`)).then(buffer => buffer.toString('utf8'));

      const fileContent = templateContent
        .replace(/\$PluralEntity\$/g, pluralEntity)
        .replace(/\$Entity\$/g, entity);

      await promisify(mkdir)(dirPath, { recursive: true });
      await promisify(writeFile)(filePath, fileContent);

      spin.succeed(`Sucesso!\n`);
    } catch (e) {
      spin.fail(`Ocorreu um erro ao criar: ${ e.message }\n`);
    }
  }

  //#endregion

}
