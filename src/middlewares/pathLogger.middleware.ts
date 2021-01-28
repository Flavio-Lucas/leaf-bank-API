import { Logger } from '@nestjs/common';

import { Request, Response } from 'express';

export function pathLogger(req: Request, res: Response, next: Function) {
  new Logger('Sentry').log(`${ req.method }:${ req.path }`);

  next();
}
