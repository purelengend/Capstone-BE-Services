import express, { Application } from 'express';
import cors from 'cors';
import createChannel from './message-queue/createChannel';
import { color, size, productVariant } from './api';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    const channel = await createChannel();

    color(app);
    size(app);
    productVariant(app, channel);
};
