import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

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
