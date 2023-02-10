import { Address } from './../entity/Address';
import { AddressRepository } from './../repository/AddressRepository';
import { AddressDTO } from './../dto/address/AddressDTO';
export class AddressService {
    private addressRepository: AddressRepository;

    constructor() {
        this.addressRepository = new AddressRepository()
    }

    async createAddress(addressDTO: AddressDTO): Promise<Address> {
        const address = Object.assign(new Address(), addressDTO);
        return await this.addressRepository.createAddress(address);
    }

    async update(id: string, addressDTO: AddressDTO): Promise<Address> {
        const existingAddress = await this.findById(id);
        const address = Object.assign(existingAddress, addressDTO);
        return await this.addressRepository.save(address)
    }

    async findById(id: string): Promise<Address> {
        return await this.addressRepository.findById(id)
    }

    async findAll() {
        return await this.addressRepository.findAll()
    }
}