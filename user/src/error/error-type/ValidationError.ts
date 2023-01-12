import STATUS_CODES from "../statusCode";
import { BaseError } from "./BaseError";

// 400 Validation Error
export class ValidationError extends BaseError {
    constructor(description = "bad request") {
        super("bad request", STATUS_CODES.BAD_REQUEST, description);
    }
}