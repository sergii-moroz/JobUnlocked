import createError from "@fastify/error";

export const UserNotFoundError = createError(
	'FST_USER_NOT_FOUND',
	'User not found',
	401
);

export const InvalidCredentialsError = createError(
	'FST_INVALID_CREDENTIALS',
	'Invalid email or password',
	401
);

export const UserAlreadyExistsError = createError(
	'FST_USER_ALREADY_EXISTS',
	'Username or email already exists',
	409 // HTTP status code (Conflict)
);

export const RateLimitError = createError(
	'FST_RATE_LIMIT',
	'Too many login attempts',
	429
);
