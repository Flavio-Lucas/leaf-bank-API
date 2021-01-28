//#region Imports

import { BadRequestException, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { validatePayload } from '../../../utils/functions';
import { EnvService } from '../../env/services/env.service';
import { CreateUserPayload } from '../../users/models/create-user.payload';
import { UserService } from '../../users/services/user.service';

//#endregion

/**
 * A classe que representa o controlador que lida com as rotas de teste dessa aplicação
 */
@ApiTags('tests')
@Controller('tests')
export class TestController {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly connection: Connection,
    private readonly env: EnvService,
    private readonly user: UserService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que limpa todo o banco de dados
   */
  @Post('clear')
  @ApiOperation({ summary: 'Clear all the database.' })
  @ApiCreatedResponse({ description: 'All database was clear with successful.' })
  @ApiBadRequestResponse({ description: 'It is only permitted to perform this operation when is in test environment.' })
  @HttpCode(204)
  public async clearDatabase(): Promise<void> {
    if (!this.env.isTest)
      throw new BadRequestException('Não é permitido limpar o banco de dados caso não esteja no ambiente de teste.');

    await this.connection.synchronize(true);
  }

  /**
   * Método que realiza o seed básico nas tabelas
   */
  @Post('seed/users')
  @ApiOperation({ summary: 'Seed default users to database.' })
  @ApiNoContentResponse({ description: 'The database was seeded with successful.' })
  @ApiBadRequestResponse({ description: 'It is only permitted to perform this operation when is in test environment.' })
  @HttpCode(204)
  public async seedUsers(): Promise<void> {
    if (!this.env.isTest)
      throw new BadRequestException('Não é permitido limpar o banco de dados caso não esteja no ambiente de teste.');

    const admin = new UserEntity({
      roles: 'admin',
    });

    await this.user.create(admin, await validatePayload(CreateUserPayload, {
      email: 'admin@email.com',
      password: '123456',
      roles: 'admin',
    }));

    await this.user.create(admin, await validatePayload(CreateUserPayload, {
      email: 'liga@email.com',
      password: '123456',
      roles: 'user',
    }));

    await this.user.create(admin, await validatePayload(CreateUserPayload, {
      email: 'fablab@email.com',
      password: '123456',
      roles: 'user',
    }));
  }

  //#endregion

}
