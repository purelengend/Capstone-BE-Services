import { NotFoundError } from './../error/error-type/NotFoundError';
import { Address } from './../entity/Address';
import { AppDataSource } from './../data-source';
import { EntityNotFoundError } from 'typeorm';

export class AddressRepository {
    private repository = AppDataSource.getRepository(Address);

    async save(address: Address) {
        return this.repository.save(address);
    }

    async createAddress(address: Address): Promise<Address> {
        return await this.save(address)
    }

    async update(address: Address): Promise<Address> {
        try {
            let existingAddress = await this.findById(address.id);
            existingAddress = {
                ...existingAddress,
                ...address
            }
            return this.repository.save(address);
        } catch (error) {
            
            throw new Error(error);
        }
    }

    async findById(id: string): Promise<Address> {
        try {
            return this.repository.findOneOrFail({
                where: {
                    id
                }
            })
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Address with id ${id} not found`);
            }
            throw new Error(error)
        }
    }

    async findAll() {
        return this.repository.find();
    }
}