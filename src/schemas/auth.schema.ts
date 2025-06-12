import { errorResponseSchema } from "./error-response-schema.js";

export const registerSchema = {
	body: {
		type: 'object',
		required: ['email', 'password', 'repeated'],
		properties: {
			email: { type: 'string', format: 'email', minLength: 5, maxLength: 128 },
			password: { type: 'string', minLength: 6, maxLength: 64 },
			repeated: { type: 'string', minLength: 6, maxLength: 64 },
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean'}
			},
			required: ['success'],
			additionalProperties: false
		},
		400: errorResponseSchema,	// For validation errors
		409: errorResponseSchema,	// FST_USER_ALREADY_EXISTS
		500: errorResponseSchema	// Server errors
	}
}

export const loginSchema = {
	body: {
		type: 'object',
		required: ['email', 'password'],
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string', minLength: 6 },
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean'}
			},
			required: ['success'],
			additionalProperties: false
		},
		202: {
			type: 'object',
			properties: {
				requires2FA: { type: 'boolean' },
				token: { type: 'string' }
			},
			required: ['requires2FA', 'token'],
			additionalProperties: false
		},
		401: errorResponseSchema,
		404: errorResponseSchema,	// UserNotFoundError
		429: errorResponseSchema	// Rate limiting
	}
}

export const logoutSchema = {
	description: 'Clears authentication and CSRF cookies to log the user out.',
	tags: ['auth'],
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean' }
			}
		}
	}
}

export const auth42CallbackSchema = {
	querystring: {
		type: 'object',
		required: ['code'],
		properties: {
			code: {
				type: 'string',
				minLength: 64,
				maxLength: 64,
				description: 'OAuth2 authorization code from 42 Intranet'
			},
		},
	},
	response: {
		200: {
			type: 'object',
			properties: {
				success: { type: 'boolean', const: true }
			},
			required: ['success'],
			additionalProperties: false
		},
		302: {
			type: 'object',
			description: 'Redirect with authentication cookies set',
			additionalProperties: true
		},
		400: errorResponseSchema, // Invalid request (missing code, etc)
		401: errorResponseSchema, // Authentication failed (invalid code)
		403: errorResponseSchema, // Forbidden (account suspended, etc)
		409: errorResponseSchema, // Conflict (account already linked)
		429: errorResponseSchema  // Rate limiting
	}
};
