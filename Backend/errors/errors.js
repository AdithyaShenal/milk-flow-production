export class AppError extends Error {
  constructor(status, message, code = "ERROR", details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details = null) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(404, message, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal Server Error") {
    super(500, message, "INTERNAL_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resources Conflict Error") {
    super(409, message, "CONFLICT_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Request Validation Error") {
    super(400, message, "BAD_REQUEST");
  }
}
