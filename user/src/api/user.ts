import { USER_RPC, REVIEW_SERVICE } from './../config/index';
import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { UserService } from './../service/UserService';
import { Application } from "express";
import observerRPC from './../message-queue/rpc/observerRPC';
import publishMessage from './../message-queue/pub-sub/publishMessage';
import { Channel } from 'amqplib';
import EventType from './../types/eventType';

export default (app: Application, channel: Channel) => {
    const userService = new UserService();

    observerRPC(USER_RPC, userService)

    app.get('/auth/user', async (_, res, next) => {
        try {
            return res.status(200).json(await userService.getAllUsers());
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/auth/user/:id', async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };
            return res.status(200).json(await userService.getUserById(id));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/auth/userAddress/:userId', async (req, res, next) => {
        try {
            const { userId } = req.params;
            return res.status(200).json(await userService.getAddressOfUser(userId));
        } catch (error) {
            next(error);
            return;
        }
    })

    app.post('/auth/user/createAdmin', async (req, res, next) => {
        try {
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.createAdmin(userDTO));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/auth/user', async (req, res, next) => {
        try {
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.createCustomer(userDTO));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.put('/auth/user/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await userService.updateCustomer(id, userDTO));
        } catch (error) {
            next(error);
            return;
        }
    });

    app.delete('/auth/user/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            await userService.deleteUsersById(id);
            const payload = {
                event: EventType.DELETE_USER,
                data: {
                    userId: id
                },
            };
            publishMessage(channel, REVIEW_SERVICE, payload);
            return res.status(200).json({ 
                status: 'SUCCESS',
                message: 'Delete user successfully' 
            });
        } catch (error) {
            next(error);
            return;
        }
    });
}