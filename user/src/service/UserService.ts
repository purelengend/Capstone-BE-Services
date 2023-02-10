import { Address } from './../entity/Address';
import { RPCTypes } from './../types/rpcType';
import { IService } from './IService';
import { RoleService } from './RoleService';
import { UserRoleType } from './../types/userRoleType';
import { CreateUserDTO } from './../dto/user/CreateUserDTO';
import { User } from './../entity/User';
import { UserRepository } from './../repository/UserRepository';
import argon2 from 'argon2'
import { RPCPayload } from 'src/types/utilTypes';

export class UserService implements IService{
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

    async getUserAndAddressById(id: string): Promise<User | null> {
        return await this.userRepository.findUserAndAddressById(id);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findByUsername(username)
    }

    async getAddressOfUser(id: string): Promise<Address | null> {
        return await this.userRepository.findAddressOfUser(id);
    }

    async createCustomer(userDTO: CreateUserDTO, address?: Address): Promise<User> {
        const { username, password } = userDTO;

        const existingUser = await this.userRepository.findByUsername(username);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await argon2.hash(password);
        const role = await this.roleService.getRoleByName(UserRoleType.CUSTOMER);
        const newUser = Object.assign(new User(), userDTO, {
            role, 
            password: hashedPassword,
            address
        });

        return await this.userRepository.save(newUser);
    }

    async updateCustomer(id: string, userDTO: CreateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }
        const newUser = Object.assign(existingUser, userDTO);
        return await this.userRepository.save(newUser);
    }

    async createAdmin(userDTO: CreateUserDTO) {
        const { username, password } = userDTO;

        const existingUser = await this.userRepository.findByUsername(username);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await argon2.hash(password);
        const role = await this.roleService.getRoleByName(UserRoleType.ADMIN);
        const newUser = Object.assign(new User(), userDTO, {
            role, 
            password: hashedPassword
        });

        return await this.userRepository.save(newUser);
    }

    async serveRPCGetUserInfoById(id: string) {
        const user = await this.getUserById(id);
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
        }
    }

    async serveRPCGetUserBillingInfoById(id: string) {
        const user = await this.getUserAndAddressById(id);
        if (!user || !user.address) {
            return null;
        }
        return {
            id: user.id,
            username: user.username,
            phoneNumber: user.phoneNumber,
            email: user.email,
            streetAddress: user.address.streetAddress,
            district: user.address.district || '',
            city: user.address.city,
            state: user.address.state || '',
            country: user.address.country,
            zipCode: user.address.zipCode || '',
        }
    }

    subscribeEvents(_: string): void {
        throw new Error('Method not implemented.');
    }
    serveRPCRequest(payload: RPCPayload) {
        const { type, data } = payload;
        switch (type) {
            case RPCTypes.GET_USER_INFO_BY_USER_ID:
                return this.serveRPCGetUserInfoById(data);
            case RPCTypes.GET_USER_BILLING_INFO_BY_USER_ID:
                return this.serveRPCGetUserBillingInfoById(data);

            default:
                return;
        }
    }
}