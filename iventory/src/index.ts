import express from 'express';
import expressApp from './express-app';

import { PORT } from './config';
import errorHandler from './error/errorHandler';
import { AppDataSource } from './data-source';

const main = async () => {
    // to initialize initial connection with the database, register all entities
    // and "synchronize" database schema, call "initialize()" method of a newly created database
    // once in your application bootstrap
    AppDataSource.initialize()
        .then(() => {
            // here you can start to work with your database
            console.log('Database connection initialized');
        })
        .catch((error) => console.log(error));

    const app = express();

    await expressApp(app);

    errorHandler(app);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((error) => {
    console.error(error);
});
