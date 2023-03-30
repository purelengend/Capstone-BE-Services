import { AddressDTO } from './../dto/address/AddressDTO';
import { Application } from "express";
import { AddressService } from "./../service/AddressService";

export default (app: Application) => {
    const addressService = new AddressService();

    app.get('/auth/address', async (_, res, next) => {
        try {
            return res.status(200).json(await addressService.findAll());
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/auth/address/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            return res.status(200).json(await addressService.findById(id));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/auth/address', async (req, res, next) => {
        try {
            const addressDTO = req.body as AddressDTO;
            return res.status(200).json(await addressService.createAddress(addressDTO));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/auth/address/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const addressDTO = req.body as AddressDTO;
            return res.status(200).json(await addressService.update(id, addressDTO));
        } catch (error) {
            next(error);
            return;
        }
    });
}