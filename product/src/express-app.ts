import express, { Application } from 'express';
import cors from 'cors';
import { product } from './api/index';

export default (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());

    product(app);

    app.use(express.static(__dirname + '/public'));
};
