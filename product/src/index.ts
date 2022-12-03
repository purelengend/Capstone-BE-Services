import express from 'express';
import expressApp from './express-app';
import databaseConnection from './repository/connection';
import { PORT } from './config';

const main = async () => {
    const app = express();

    await databaseConnection();

    expressApp(app);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((error) => {
    console.error(error);
});
