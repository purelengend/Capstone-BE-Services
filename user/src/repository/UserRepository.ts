import { Address } from './../entity/Address';
import { User } from './../entity/User';
import { AppDataSource } from './../data-source';
import { NotFoundError } from './../error/error-type/NotFoundError';
export class UserRepository {
    private repository = AppDataSource.getRepository(User)

    async findAll() {
        return this.repository.find(
            {
                relations: {
                    role: true
                }
            }
        );
    }

    async findById(id: string) : Promise<User | null> {
        try {
            return this.repository.findOne({
                where: {
                    id: id
                },
                relations: {
                    role: true
                }
            })
        } catch (error) {
            throw new Error(error)
        }
    }

    async findUserAndAddressById(id: string): Promise<User | null> {
        try {
            return this.repository.findOne({
                where: {
                    id: id
                },
                relations: {
                    address: true
                }
            })
        } catch (error) {
            throw new Error(error)
        }
    }

    async findAddressOfUser(id: string): Promise<Address> {
        try {
            const user = await this.repository.findOne({
                select: ['address'],
                where: {
                    id
                },
                relations: {
                    address: true
                }
            })
            if (!user) {
                throw new NotFoundError(`User with id ${id} not found`);
            }
            return user.address;
        } catch (error) {
            throw new Error(error)
        } 
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            return this.repository.findOne({
                where: {
                    username
                },
                relations: {
                    role: true
                }
            })
        } catch (error) {
            throw new Error(error);
        }
    }

    async save(user: User): Promise<User> {
        try {
            return this.repository.save(user);
        } catch (error) {
            throw new Error(error)
        }
    }
}