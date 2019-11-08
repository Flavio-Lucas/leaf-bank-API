//#region Imports

import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

const apicache = require('apicache');

import { Roles } from '../../decorators/roles/roles.decorator';

//#endregion

/**
 * O controlador que lida com as rotas do APICache
 */
@ApiBearerAuth()
@ApiUseTags('cache')
@Controller('cache')
export class CacheController {

  /**
   * Método que retorna as informações sobre performance
   */
  @Roles('admin')
  @Get('performance')
  public getPerformance(): unknown {
    // @ts-ignore
    return apicache.getPerformance();
  }

  /**
   * Método que retorna as informações sobre o cache
   */
  @Roles('admin')
  @Get('index')
  public getIndex(): unknown {
    return apicache.getIndex();
  }

  /**
   * Método que limpa todo o cache
   */
  @Roles('admin')
  @Post('reset')
  public getReset(): void {
    return apicache.resetIndex();
  }

  /**
   * Método que retorna a duração do cache
   */
  @Roles('admin')
  @Get('duration')
  public getDuration(): object {
    return { duration: apicache.getDuration('5 minutes') };
  }
}
