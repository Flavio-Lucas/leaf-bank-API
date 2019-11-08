const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'dev',
  synchronize: false,
  logging: false,
  entities: [
    'src/typeorm/entities/**/*{.ts,.js}',
  ],
  migrations: [
    'src/typeorm/migrations/**/*{.ts,.js}',
  ],
  cli: {
    entitiesDir: 'src/typeorm/entities',
    migrationsDir: 'src/typeorm/migrations',
  },
};

module.exports = config;
