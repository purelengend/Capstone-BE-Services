import { RegisterCustomerDTO } from './../dto/user/RegisterCustomerDTO';
import { UserService } from './UserService';
import { AddressService } from './AddressService';

export class RegisterService {
    private addressService: AddressService;
    private userService: UserService;

    constructor() {
        this.addressService = new AddressService();
        this.userService = new UserService();
    }

    async registerUser(registerCustomerDTO: RegisterCustomerDTO) {
        const { streetAddress, district, city, state, country, zipCode } = registerCustomerDTO;
        const addressDTO = { streetAddress, district, city, state, country, zipCode };

        const address = await this.addressService.createAddress(addressDTO);

        const { username, password, email, phoneNumber, gender, avatarUrl } = registerCustomerDTO;
        const userDTO = { username, password, email, phoneNumber, gender, avatarUrl };

        return await this.userService.createCustomer(userDTO, address);
    }
}