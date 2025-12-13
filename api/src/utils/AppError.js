export class AppError extends Error {
   constructor(message, status = 500, details) {
      super(message);
      this.status = status;
      this.details = details;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
   }
}

export class BadRequestError extends AppError {
   constructor(message = "Bad Request", details) {
      super(message, 400, details);
   }
}

export class UnauthorizedError extends AppError {
   constructor(message = "Unauthorized", details) {
      super(message, 401, details);
   }
}

export class ForbiddenError extends AppError {
   constructor(message = "Forbidden", details) {
      super(message, 403, details);
   }
}
