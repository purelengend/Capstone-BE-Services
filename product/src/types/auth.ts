export type UserTokenPayload = {
    userId: string;
    username: string;
    role: string;
};

export enum UserRoleType {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}