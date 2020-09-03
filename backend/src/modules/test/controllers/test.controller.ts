//#region Imports

import { BadRequestException, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

import { UserEntity } from '../../../typeorm/entities/user.entity';
import { EnvService } from '../../env/services/env.service';

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

    const userRepository = this.connection.getRepository(UserEntity);

    const admin = new UserEntity({
      roles: 'admin',
      email: 'admin@email.com',
      password: '123456',
    });
    const firstUser = new UserEntity({
      roles: 'user',
      email: 'liga@email.com',
      password: '123456',
    });
    const secondUser = new UserEntity({
      roles: 'user',
      email: 'fablab@email.com',
      password: '123456',
    });

    await userRepository.save(admin);
    await userRepository.save(firstUser);
    await userRepository.save(secondUser);
  }

  //#endregion

}
