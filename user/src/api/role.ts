import { UserRoleType } from './../types/userRoleType';
import { RoleService } from './../service/RoleService';
import { Application } from 'express';

export default (app: Application) => {
    const roleService = new RoleService()

    app.get('/auth/role', async (_, res, next) => {
        try {
            return res.status(200).json(await roleService.getAllRoles());
        } catch (error) {
            next(error);
            return;
        }
    });

    app.get('/auth/role/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            return res.status(200).json(await roleService.getRoleById(parseInt(id)));
        } catch (error) {
            next(error);
            return;
        }
    });


    app.post('/auth/role', async (req, res, next) => {
        try {
            const name = req.body.name as UserRoleType;           
            return res.status(200).json(await roleService.createRole(name));
        } catch (error) {
            next(error);
            return;
        }
    });
}