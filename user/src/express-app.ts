import express, { Application } from 'express';
import cors from 'cors';
import { AuthController, UserController, RoleController, AddressController } from './api/index';
// import createChannel from './message-queue/createChannel';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    // const channel = await createChannel();

    RoleController(app);
    UserController(app);
    AuthController(app);
    AddressController(app);
};
