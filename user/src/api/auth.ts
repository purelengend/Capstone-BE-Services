import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { AuthService } from './../service/AuthService';
import { Application } from "express";

export default (app: Application) => {
    const authService = new AuthService();
    
    app.post('/login', async (req, res, next) => {
        try {
            const { username, password } = req.body;
            return res.status(200).json(await authService.login(username, password));
        } catch (error) {
            next(error);
            return;
        }    
    });

    app.post('/register', async (req, res, next) => {
        try {
            const userDTO = req.body as CreateUserDTO;
            return res.status(200).json(await authService.register(userDTO)); 
        } catch (error) {
            next(error);
            return;
        }
    });

    app.post('/refreshAccessToken',async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            return res.status(200).json(await authService.refreshAccessToken(refreshToken));
        } catch (error) {
            next(error);
            return;
        }
    });
}