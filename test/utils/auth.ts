//#region Imports

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

//#endregion

/**
 * Método que retorna um token JWT para a autenticação de um usuário que tem permissões de Administrador
 *
 * @param app A referência para a aplicação NestJS
 */
export async function getAdminToken(app: INestApplication): Promise<string> {
  const { body: tokenProxy } = await request(app.getHttpServer())
    .post('/auth/local')
    .send({ username: 'admin@email.com', password: '123456' })
    .expect(201);

  return tokenProxy.token.split(' ')[1];
}

/**
 * Método que retorna um token JWT para a autenticação de um usuário que representa o setor LIGA
 *
 * @param app A referência para a aplicação NestJS
 */
export async function getLigaToken(app: INestApplication): Promise<string> {
  const { body: tokenProxy } = await request(app.getHttpServer())
    .post('/auth/local')
    .send({ username: 'liga@email.com', password: '123456' })
    .expect(201);

  return tokenProxy.token.split(' ')[1];
}

/**
 * Método que retorna um token JWT para a autenticação de um usuário que representa o setor Fablab
 *
 * @param app A referência para a aplicação NestJS
 */
export async function getFablabToken(app: INestApplication): Promise<string> {
  const { body: tokenProxy } = await request(app.getHttpServer())
    .post('/auth/local')
    .send({ username: 'fablab@email.com', password: '123456' })
    .expect(201);

  return tokenProxy.token.split(' ')[1];
}
