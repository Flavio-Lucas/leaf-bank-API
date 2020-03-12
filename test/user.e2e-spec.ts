import * as request from 'supertest';
import { UserUpdatePayload } from '../src/modules/users/models/user-update.payload';
import { TestUsersId } from './models/test-users-id.enum';

import { getAdminToken, getFablabToken, getLigaToken } from './utils/auth';
import { cleanDatabaseAndSeedUsers } from './utils/db';
import { getInstanceOfApplication } from './utils/nestjs';

describe('User (e2e)', () => {
  let app;

  beforeAll(async () => {
    app = await getInstanceOfApplication();
  });

  beforeEach(async () => {
    await cleanDatabaseAndSeedUsers(app);
  });

  describe('GET ME', () => {
    it('should get me', async () => {
      const ligaToken = await getLigaToken(app);

      const { body } = await request(app.getHttpServer())
        .get('/users/me')
        .auth(ligaToken, { type: 'bearer' })
        .send()
        .expect(200);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('email', 'liga@email.com');
      expect(body).toHaveProperty('roles');
      expect(body).not.toHaveProperty('password');
    });

    it('should get status 401 when try get me when it is not authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/me')
        .send()
        .expect(401);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Unauthorized');
      expect(body).toHaveProperty('statusCode');
    });
  });

  describe('GET MANY', () => {
    it('should get status 401 when get users without send token', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .send()
        .expect(401);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Unauthorized');
      expect(body).toHaveProperty('statusCode');
    });

    it('should get status 401 when get users with user that it is not admin', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .send()
        .expect(401);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Unauthorized');
      expect(body).toHaveProperty('statusCode');
    });

    it('should get users when logged with admin', async () => {
      const adminToken = await getAdminToken(app);
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .auth(adminToken, { type: 'bearer' })
        .send()
        .expect(200);

      expect(body).toBeDefined();
      expect(body).toHaveLength(3);
    });
  });

  describe('GET ONE', () => {
    it('should get user by id when it is logged with the same user', async () => {
      const ligaToken = await getLigaToken(app);
      const { body } = await request(app.getHttpServer())
        .get(`/users/${ TestUsersId.LIGA }`)
        .auth(ligaToken, { type: 'bearer' })
        .send();

      expect(body).toBeDefined();
      expect(body).toHaveProperty('email', 'liga@email.com');
      expect(body).not.toHaveProperty('password');
    });

    it('should get status 401 when try get user info of other user', async () => {
      const ligaToken = await getLigaToken(app);
      const { body } = await request(app.getHttpServer())
        .get(`/users/${ TestUsersId.FABLAB }`)
        .auth(ligaToken, { type: 'bearer' })
        .send()
        .expect(401);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Unauthorized');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    });

    it('should get user by id when it is logged with admin', async () => {
      const adminToken = await getAdminToken(app);
      const { body } = await request(app.getHttpServer())
        .get(`/users/${ TestUsersId.LIGA }`)
        .auth(adminToken, { type: 'bearer' })
        .send()
        .expect(200);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('email', 'liga@email.com');
      expect(body).not.toHaveProperty('password');
    });

    it('should get status 404 when try get user by id that not exists', async () => {
      const adminToken = await getAdminToken(app);
      const updatePayload: UserUpdatePayload = {
        email: 'joga10@email.com',
      };
      const { body } = await request(app.getHttpServer())
        .get(`/users/999`)
        .auth(adminToken, { type: 'bearer' })
        .send(updatePayload)
        .expect(404);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Not Found');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    });
  });

  describe('UPDATE', () => {
    it('should update user by id when logged with same user', async () => {
      const ligaToken = await getLigaToken(app);
      const updatePayload: UserUpdatePayload = {
        email: 'joga10@email.com',
      };
      const { body } = await request(app.getHttpServer())
        .put(`/users/${ TestUsersId.LIGA }`)
        .auth(ligaToken, { type: 'bearer' })
        .send(updatePayload)
        .expect(200);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('email', updatePayload.email);
      expect(body).not.toHaveProperty('password');
    });

    it('should update other user by id when logged with admin user', async () => {
      const adminToken = await getAdminToken(app);
      const updatePayload: UserUpdatePayload = {
        email: 'joga10@email.com',
      };
      const { body } = await request(app.getHttpServer())
        .put(`/users/${ TestUsersId.LIGA }`)
        .auth(adminToken, { type: 'bearer' })
        .send(updatePayload)
        .expect(200);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('email', updatePayload.email);
      expect(body).not.toHaveProperty('password');
    });

    it('should get status 401 when try update user by id when logged with other user', async () => {
      const fablabToken = await getFablabToken(app);
      const updatePayload: UserUpdatePayload = {
        email: 'joga10@email.com',
      };
      const { body } = await request(app.getHttpServer())
        .put(`/users/${ TestUsersId.LIGA }`)
        .auth(fablabToken, { type: 'bearer' })
        .send(updatePayload)
        .expect(401);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Unauthorized');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    });

    it('should get status 404 when try update user by id that not exists', async () => {
      const adminToken = await getAdminToken(app);
      const updatePayload: UserUpdatePayload = {
        email: 'joga10@email.com',
      };
      const { body } = await request(app.getHttpServer())
        .put(`/users/999`)
        .auth(adminToken, { type: 'bearer' })
        .send(updatePayload)
        .expect(404);

      expect(body).toBeDefined();
      expect(body).toHaveProperty('error', 'Not Found');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    });
  });
});