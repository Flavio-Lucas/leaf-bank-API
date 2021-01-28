//#region Imports

import { BadRequestException, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CrudRequest, ParsedRequest } from '@nestjsx/crud';

import { ProtectTo } from '../decorators/protect/protect.decorator';
import { RolesEnum } from '../modules/auth/models/roles.enum';
import { UserEntity } from '../modules/users/entities/user.entity';
import { isAdminUser } from '../utils/functions';
import { BaseCrudController } from './base-crud.controller';
import { BaseCrudService } from './base-crud.service';
import { BaseEntity } from './base-entity';

//#endregion

/**
 * A classe que representa o controller base para o crud
 */
export class BaseEntityCrudController<TEntity extends BaseEntity, TService extends BaseCrudService<TEntity>> extends BaseCrudController<TEntity, TService> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    service: TService,
  ) {
    super(service);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que desativa uma entidade
   *
   * @param id A identificação da entidade
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Put('/:id/disable')
  @ApiOperation({ summary: 'Disable one Entity' })
  @ApiOkResponse({ description: 'The entity was disabled with successful.' })
  @ApiNotFoundResponse({ description: 'The entity was not found' })
  public async disable(@Param('id') id: string): Promise<TEntity> {
    const entity = await this.service.repository.findOne(id);

    if (!entity)
      throw new NotFoundException('A entidade procurada não existe.');

    if (entity instanceof UserEntity && isAdminUser(entity))
      throw new BadRequestException('Você não tem permissão para desativar um usuário que também é administrador.');

    entity.isActive = false;

    return await this.service.repository.save(entity as any);
  }

  /**
   * Método que ativa uma nova entidade
   *
   * @param id A identificação da entidade
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo(RolesEnum.ADMIN)
  @Put('/:id/enable')
  @ApiOperation({ summary: 'Enable one Entity' })
  @ApiOkResponse({ description: 'The entity was disabled with successful.' })
  @ApiNotFoundResponse({ description: 'The entity was not found' })
  public async enable(@Param('id') id: string, @ParsedRequest() crudRequest: CrudRequest): Promise<TEntity> {
    const entity = await this.service.repository.findOne(id);

    if (!entity)
      throw new NotFoundException('A entidade procurada não existe.');

    if (entity instanceof UserEntity && isAdminUser(entity))
      throw new BadRequestException('Você não tem permissão para ativar um usuário que também é administrador.');

    entity.isActive = true;

    return await this.service.repository.save(entity as any);
  }

  //#endregion

}
