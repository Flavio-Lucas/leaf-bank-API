//#region Imports

import { NotFoundException, Param, Put } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CrudRequest, ParsedRequest } from '@nestjsx/crud';

import { ProtectTo } from '../decorators/protect/protect.decorator';
import { BaseEntity } from './base-entity';
import { BaseCrudController } from './base-crud.controller';
import { BaseCrudService } from './base-crud.service';

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
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('admin')
  @Put('/:id/disable')
  @ApiOperation({ title: 'Disable one Entity' })
  @ApiOkResponse({ description: 'The entity was disabled with successful.' })
  @ApiNotFoundResponse({ description: 'The entity was not found' })
  public async disable(@Param('id') id: number, @ParsedRequest() crudRequest: CrudRequest): Promise<TEntity> {
    const entity = await this.service.repository.findOne(id);

    if (!entity)
      throw new NotFoundException('A entidade procurada não existe.');

    entity.isActive = false;

    return await this.service.repository.save(entity as any);
  }

  /**
   * Método que ativa uma nova entidade
   *
   * @param id A identificação da entidade
   * @param crudRequest As informações da requisição do CRUD
   */
  @ProtectTo('admin')
  @Put('/:id/enable')
  @ApiOperation({ title: 'Enable one Entity' })
  @ApiOkResponse({ description: 'The entity was disabled with successfull.' })
  @ApiNotFoundResponse({ description: 'The entity was not found' })
  public async enable(@Param('id') id: number, @ParsedRequest() crudRequest: CrudRequest): Promise<TEntity> {
    const entity = await this.service.repository.findOne(id);

    if (!entity)
      throw new NotFoundException('A entidade procurada não existe.');

    entity.isActive = true;

    return await this.service.repository.save(entity as any);
  }

  //#endregion

}
