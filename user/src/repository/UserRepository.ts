import { User } from './../entity/User';
import { AppDataSource } from './../data-source';
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