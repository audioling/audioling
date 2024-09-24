import { HTTPException } from 'hono/http-exception';

type HTTPErrorCode =
    | 400
    | 401
    | 403
    | 404
    | 405
    | 406
    | 409
    | 410
    | 412
    | 415
    | 422
    | 429
    | 500
    | 501
    | 502
    | 503
    | 504
    | 505;

class BadRequestError extends HTTPException {
    name = 'BadRequestError';

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(400, {
            cause,
            message: message || 'Bad request',
        });
    }
}

class ConflictError extends HTTPException {
    name = 'ConflictError';
    statusCode: HTTPErrorCode = 409;

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(409, {
            cause,
            message: message || 'Conflict',
        });
    }
}

class InternalServerError extends HTTPException {
    name = 'InternalServerError';

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(500, {
            cause,
            message: message || 'Internal server error',
        });
    }
}

class NotFoundError extends HTTPException {
    name = 'NotFoundError';

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(404, {
            cause,
            message: message || 'Not found',
        });
    }
}

class NotImplementedError extends HTTPException {
    name = 'NotImplementedError';
    statusCode: HTTPErrorCode = 501;

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(501, {
            cause,
            message: message || 'Not implemented',
        });
    }
}

class PermissionDeniedError extends HTTPException {
    name = 'PermissionDeniedError';
    statusCode: HTTPErrorCode = 403;

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(403, {
            cause,
            message: message || 'Permission denied',
        });
    }
}

class UnauthorizedError extends HTTPException {
    name = 'UnauthorizedError';
    statusCode: HTTPErrorCode = 401;

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(401, {
            cause,
            message: message || 'Unauthorized',
        });
    }
}

class ValidationError extends HTTPException {
    name = 'ValidationError';
    statusCode: HTTPErrorCode = 422;

    constructor(options?: { cause?: unknown; message?: string }) {
        const { cause, message } = options || {};
        super(422, {
            cause,
            message: message || 'Validation failed',
        });
    }
}

export const apiError = {
    badRequest: BadRequestError,
    conflict: ConflictError,
    internalServer: InternalServerError,
    notFound: NotFoundError,
    notImplemented: NotImplementedError,
    permissionDenied: PermissionDeniedError,
    unauthorized: UnauthorizedError,
    validation: ValidationError,
};
