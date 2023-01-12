import { UserRoleType } from './../types/userRoleType';
import { RoleRepository } from './../repository/RoleRepository';
export class RoleService {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAllRoles() {
        return await this.roleRepository.findAll();
    }

    async getRoleById(id: number) {
        return await this.roleRepository.findById(id)
    }

    async getRoleByName(name: string) {
        return await this.roleRepository.findByName(name)
    }

    async createRole(role: UserRoleType) {
        const name = UserRoleType[role];
        return await this.roleRepository.createRole(name);
    }

    async updateRole(id: number, name: UserRoleType) {
        return await this.roleRepository.update(id, name);
    }
}