import { AuthService } from './../service/AuthService';
import { Application } from "express";
import { RegisterService } from './../service/RegisterService';
import { RegisterCustomerDTO } from 'src/dto/user/RegisterCustomerDTO';

export default (app: Application) => {
    const authService = new AuthService();
    const registerService = new RegisterService();
    
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
            const registerCustomerDTO = req.body as RegisterCustomerDTO;
            return res.status(200).json(await registerService.registerUser(registerCustomerDTO)); 
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