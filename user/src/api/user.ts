import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { UserService } from './../service/UserService';
import { Application } from "express";

export default (app: Application) => {
    const userService = new UserService();

    app.get('/user', async (_, res, next) => {
        try {
            return res.status(200).json(await userService.getAllUsers());
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/user/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            return res.status(200).json(await userService.getUserById(id));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/user', async (req, res, next) => {
        try {
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.createCustomer(userDTO));
        } catch (error) {
            next(error);
            return;
        }
    });
}