import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { R } from '@nestjsx/crud/lib/crud';

import { RolesGuard } from '../../guards/roles/roles.guard';
import { applyDecorators, NestCustomDecorator } from '../../utils/apply-decorator';
import { Roles } from '../roles/roles.decorator';

export function ProtectTo(...roles: string[]): NestCustomDecorator {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard(), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'When user don\'t have access to resource' }),
  );
}

export const ApplyDecoratorsIfEnvExists = (envName: string | string[], ...guards) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const envs = Array.isArray(envName) ? envName : [envName];

    if (envs.every(env => !!process.env[env]))
      R.setDecorators(guards, descriptor, 'value');
  };
};
