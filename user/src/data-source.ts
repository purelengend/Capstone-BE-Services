import { DataSource } from 'typeorm';
import { __prod__ } from './config';
import path from 'path';
import { User } from './entity/User';
import { Role } from './entity/Role';


export const AppDataSource = new DataSource({
    type: 'postgres',

    ...(__prod__
        ? { url: process.env.DATABASE_URL }
        : {
              host: 'localhost',
              port: 5432,
              username: process.env.DB_USERNAME_DEV,
              password: process.env.DB_PASSWORD_DEV,
          }),
    database: 'fu-capstone-user',
    ...(__prod__ ? {} : { synchronize: true }),
    logging: false,
    entities: [User, Role],
    subscribers: [],
    migrations: [path.join(__dirname, '/migrations/*')],
});
