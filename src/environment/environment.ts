const environment = {
  db_host: 'localhost',
  db_name: 'dev',
  db_username: 'root',
  db_password: '1234',
  db_port: 3306,
  jwt_secret: 'CHANGE_THIS_SECRET',
  jwt_expires_in: '7d',
  defaultStrategy: 'jwt',
  swagger: {
    title: 'Base API',
    description: 'A API base em NestJs',
    version: '1.0',
    basePath: 'api',
    tag: 'Base',
  },
};

export { environment };
