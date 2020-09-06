import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

import { RolesGuard } from '../../guards/roles/roles.guard';
import { RolesEnum } from '../../modules/auth/models/roles.enum';
import { applyDecorators, NestCustomDecorator } from '../../utils/apply-decorator';
import { Roles } from '../roles/roles.decorator';

export function ProtectTo(...roles: string[]): NestCustomDecorator {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Você não tem permissão para acessar esse recurso. ' }),
  );
}

export function UnprotectedRoute(): NestCustomDecorator {
  return applyDecorators(
    Roles(RolesEnum.ANONYMOUS, RolesEnum.USER, RolesEnum.ADMIN),
    UseGuards(AuthGuard(RolesEnum.ANONYMOUS), RolesGuard),
  );
}
