export class RegisterCustomerDTO{
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    gender: string;
    avatarUrl?: string;

    streetAddress: string;
    district?: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
}