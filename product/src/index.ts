import express from 'express';
import expressApp from './express-app';
import databaseConnection from './repository/connection';
import { PORT } from './config';
import errorHandler from './error/errorHandler';

const main = async () => {
    const app = express();

    await databaseConnection();

    await expressApp(app);

    errorHandler(app);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((error) => {
    console.error(error);
});
