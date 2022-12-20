import express, { Application } from 'express';
import cors from 'cors';
import { product, category } from './api/index';
import createChannel from './message-queue/createChannel';
// import {PORT } from './config/index';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());


    const channel = await createChannel();

    category(app);

    product(app, channel);

    app.use(express.static(__dirname + '/public'));
};
