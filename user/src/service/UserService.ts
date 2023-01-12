import { RoleService } from './RoleService';
import { UserRoleType } from './../types/userRoleType';
import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { User } from './../entity/User';
import { UserRepository } from './../repository/UserRepository';
import argon2 from 'argon2'

export class UserService {
    private userRepository: UserRepository;
    private roleService: RoleService;

    constructor() {
        this.userRepository = new UserRepository()
        this.roleService = new RoleService()
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id)
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findByUsername(username)
    }

    async createCustomer(userDTO: CreateUserDTO) {
        const { username, password } = userDTO;

        const existingUser = await this.userRepository.findByUsername(username);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await argon2.hash(password);
        const role = await this.roleService.getRoleByName(UserRoleType.CUSTOMER);
        const newUser = Object.assign(new User(), userDTO, {
            role, 
            password: hashedPassword
        });

        return await this.userRepository.save(newUser);
    }
}