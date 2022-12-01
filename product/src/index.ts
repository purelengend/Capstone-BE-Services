import express from 'express';
import expressApp from './express-app';

const main = async () => {
    const app = express();

    expressApp(app);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};

main().catch((error) => {
    console.error(error);
});
