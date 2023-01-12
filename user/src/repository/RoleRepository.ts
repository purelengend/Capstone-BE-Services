import { NotFoundError } from './../error/error-type/NotFoundError';
import { Role } from './../entity/Role';
import { AppDataSource } from './../data-source';
import { EntityNotFoundError } from 'typeorm';
export class RoleRepository {
    private repository = AppDataSource.getRepository(Role);

    async save(role: Role) {
        return this.repository.save(role);
    }
    
    async createRole(name: string): Promise<Role> {
        const role = new Role()
        role.name = name;
        return await this.save(role)
    }

    async update(id: number, name: string): Promise<Role> {
        try {
            const role = await this.findById(id);
            role.name = name;
            return this.repository.save(role);
        } catch (error) {
            
            throw new Error(error);
        }
    }

    async findByName(name: string): Promise<Role> {
        try {
            return this.repository.findOneOrFail({
                where: {
                    name
                },
            })
        } catch (error) {
            throw new Error(error)
        }
    }

    async findById(id: number): Promise<Role> {
        try {
            return this.repository.findOneOrFail({
                where: {
                    id
                }
            })
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error)
        }
    }

    async findAll() {
        return this.repository.find({
            relations: {
                users: true
            }
        });
    }

}