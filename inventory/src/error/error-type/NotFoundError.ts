import STATUS_CODES from '../statusCode';
import { BaseError } from './BaseError';
// 404 Not Found
export class NotFoundError extends BaseError {
    constructor(description = "not found") {
      super("not found", STATUS_CODES.NOT_FOUND, description);
    }
  }