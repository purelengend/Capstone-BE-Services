import { BaseError } from './BaseError';
import STATUS_CODES from "../statusCode";

// 403 Authorize error
export class AuthorizeError extends BaseError {
    constructor(description = "access denied") {
        super("access denied", STATUS_CODES.UN_AUTHORIZED, description);
    }
}