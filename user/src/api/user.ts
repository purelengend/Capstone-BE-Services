import { USER_RPC } from './../config/index';
import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { UserService } from './../service/UserService';
import { Application } from "express";
import observerRPC from './../message-queue/rpc/observerRPC';

export default (app: Application) => {
    const userService = new UserService();

    observerRPC(USER_RPC, userService)

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

    app.get('/userAddress/:userId', async (req, res, next) => {
        try {
            const { userId } = req.params;
            return res.status(200).json(await userService.getAddressOfUser(userId));
        } catch (error) {
            next(error);
            return;
        }
    })

    app.post('/user/createAdmin', async (req, res, next) => {
        try {
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.createAdmin(userDTO));
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

    app.put('/user/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.updateCustomer(id, userDTO));
        } catch (error) {
            next(error);
            return;
        }
    });
}