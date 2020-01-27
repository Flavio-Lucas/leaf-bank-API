//#region Imports

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { TypeOrmEntities } from '../../../utils/type-orm';
import { ConfigService } from '../../config/services/config.service';

//#endregion

/**
 * A classe que representa o serviço que constroi as configurações do Typeorm
 */
@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {

  //#region Constructor

  /**
   * Construtor padrão
   *
   * @param config O serviço que contém as configurações de ambiente
   */
  constructor(
    private readonly config: ConfigService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que obtém as configurações para o Typeorm
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    let options: TypeOrmModuleOptions = {
      database: this.config.DB_DATABASE,
      synchronize: this.config.DB_SYNCHRONIZE,
      migrationsRun: this.config.DB_MIGRATIONS_RUN,
      logging: !this.config.isProduction,
      entities: [
        ...TypeOrmEntities,
      ],
    };

    if (this.config.DB_TYPE === 'mysql') {
      options = Object.assign(options, {
        type: 'mysql',
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        // https://stackoverflow.com/questions/35553432/error-handshake-inactivity-timeout-in-node-js-mysql-module
        keepConnectionAlive: true,
        host: this.config.DB_HOST,
        port: this.config.DB_PORT,
        username: this.config.DB_USER,
        password: this.config.DB_PASSWORD,
        acquireTimeout: this.config.DB_TIMEOUT,
      });
    } else if (this.config.DB_TYPE === 'sqlite') {
      options = Object.assign(options, {
        type: 'sqlite',
      });
    } else {
      throw new InternalServerErrorException('Não há um outro tipo de banco de dados suportado, por favor, altere para MySQL o valor de DB_TYPE.');
    }

    return options;
  }

  //#endregion

}
