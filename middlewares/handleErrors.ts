// src/errors/errors.ts
import { BaseError } from "./baseErrors";

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor(message: string = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(message: string = "Bad Request") {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ValidationError extends BaseError {
  statusCode = 422;

  constructor(public errors: { message: string; field?: string }[]) {
    super("Validation failed");
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors;
  }
}

export class UnauthorizedError extends BaseError {
  statusCode = 401;

  constructor(message: string = "Unauthorized") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor(message: string = "Forbidden") {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class InternalServerError extends BaseError {
  statusCode = 500;

  constructor(message: string = "Internal Server Error") {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
