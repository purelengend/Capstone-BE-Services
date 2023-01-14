import { BaseError } from './BaseError';
import STATUS_CODES from "../statusCode";

// 500 Internal Error
export class APIError extends BaseError {
    constructor(description = "api error") {
        super(
            "api internal server error",
            STATUS_CODES.INTERNAL_ERROR,
            description
        );
    }
}