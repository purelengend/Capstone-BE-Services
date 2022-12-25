import { DataSource } from "typeorm";
import { __prod__ } from "./config";
import path from "path";
import { ProductVariant } from "./entity/ProductVariant";
import { Size } from "./entity/Size";
import { Color } from "./entity/Color";

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
    database: 'fu-capstone',
    ...(__prod__ ? {} : { synchronize: true }),
    logging: true,
    entities: [Color, Size, ProductVariant],
    subscribers: [],
    migrations: [path.join(__dirname, '/migrations/*')],
});