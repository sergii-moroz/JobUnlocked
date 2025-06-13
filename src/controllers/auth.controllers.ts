import {
	FastifyReply,
	FastifyRequest
} from "fastify";

import {
	registerPartner,
	validateRegisterInput,
	verifyPassword
} from "../services/auth.services.js";

import {
	InvalidCredentialsError,
	UserAlreadyExistsError,
	UserNotFoundError
} from "../errors/login.errors.js";

import {
	createCsrfToken,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken
} from "../services/token.services.js";

import {
	LoginInputProps,
	RegisterInputProps
} from "../types/auth.types.js";

import {
	JWTPayload,
	userRoles
} from "../types/user.types.js";

import {
	findUserByEmail,
	findUserByIntraId,
	findUserByUUID
} from "../services/user.services.js";

import {
	determineUserRole,
	get42AccessToken,
	get42UserInfo,
	register42User,
	updateUserRole
} from "../services/42.services.js";

import {
	AccessTokenExpiredError,
	AccessTokenInvalidError,
	CsrfMismatchError,
	InsufficientPermissionError,
	NoAccessTokenError,
	NoCSRFTokenError,
	NoRefreshTokenError
} from "../errors/middleware.errors.js";

import bcrypt from 'bcrypt'
import { findPartnerByEmail } from "../services/partner.services.js";

export const handlePartnerRegister = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	try {
		const { email, password } = validateRegisterInput(req.body as RegisterInputProps)

		const userExists = await findUserByEmail(email)
		if (userExists) throw new UserAlreadyExistsError()

		const hashedPassword = await bcrypt.hash(password, 10)
		const id = await registerPartner(email, hashedPassword)

		const user = { id, role: userRoles.partner }
		const accessToken = generateAccessToken(user)
		const refreshToken = generateRefreshToken(user)
		const csrfToken = createCsrfToken()

		return reply
			.setCookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15 // 15 min
			})
			.setCookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
			.setCookie('csrfToken', csrfToken, {
				httpOnly: false,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15
			})
			.send({ success: true });
	} catch (error) {
		throw error
	}
}

export const handlePartnerLogin = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	const { email, password } = req.body as LoginInputProps

	try {
		const user = await findUserByEmail(email) // TODO: findPartnerByEmail(email)
		if (!user) throw new UserNotFoundError()
		const valid = await verifyPassword(password, user.password_hash)
		if(!valid) throw new InvalidCredentialsError()

		// if (user.two_factor_enabled) {
		// 	const tempToken = generate2FAAccessToken(user);
		// 	return reply.code(202).send({ requires2FA: true, token: tempToken });
		// }

		// Normal login (no 2FA)
		const accessToken = generateAccessToken({ id: user.id, role: user.role });
		const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
		const csrfToken = createCsrfToken();

		return reply
			.setCookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15 // 15 min
			})
			.setCookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
			.setCookie('csrfToken', csrfToken, {
				httpOnly: false,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15
			})
			.send({ success: true });

	} catch (error) {
		throw error
	}
}

export const handle42Login = async (
	req:		FastifyRequest<{ Querystring: { code: string } }>,
	reply:	FastifyReply
) => {
	try {
		// 1. Exchange code for token
		const code = req.query.code
		const tokenResponse = await get42AccessToken(code);

		// 2. Get user info from 42 API
		const intraUser = await get42UserInfo(tokenResponse.access_token);
		const role = await determineUserRole(intraUser)

		// 3. Find or create user in your DB
		let user = await findUserByIntraId(intraUser.id);
		let payload: JWTPayload
		console.log("user with intra_id from my local db:", user)

		if (!user) {
			const id = await register42User(intraUser, role)
			payload = { id, role }

		} else {
			// 3a. Check if role changed
			if (role !== user.role) await updateUserRole(user.id, role)
			user.role = role
			payload = {id: user.id, role: user.role }
		}

		// 4. Generate JWT and set cookies
		const accessToken = generateAccessToken(payload)
		const refreshToken = generateRefreshToken(payload)
		const csrfToken = createCsrfToken()

		return reply
			.setCookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15 // 15 min
			})
			.setCookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
			.setCookie('csrfToken', csrfToken, {
				httpOnly: false,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15
			})
			.setCookie('access_token_42', tokenResponse.access_token, {
				httpOnly: false,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15 * 24 * 7 // 7 days
			})
			.redirect(process.env.OAUTH_42_REDIRECT_HOME_URI || '/');
	} catch (error) {
		throw error
	}
}

export const handleLogout = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	reply
		.clearCookie('accessToken', { path: '/' })
		.clearCookie('refreshToken', { path: '/' })
		.clearCookie('csrfToken', { path: '/' })
		.send({ success: true });
}

export const authenticateWithRole = async (requiredRole: userRoles) => {
	return async (req: FastifyRequest, reply:	FastifyReply) => {
		const accessToken = req.cookies.accessToken

		if (!accessToken) throw new NoAccessTokenError()

		try {
			const decoded = verifyAccessToken(accessToken)
			const user = await findUserByUUID(decoded.id)

			if (!user) throw new UserNotFoundError()

			if (user.role !== requiredRole) throw new InsufficientPermissionError()

			req.user = user

		} catch (error: any) {
			if (error.name === 'TokenExpiredError') throw new AccessTokenExpiredError()
			throw error
		}
	}
}

export const authenticate = async (
	req: FastifyRequest,
	reply: FastifyReply
) => {
	const accessToken = req.cookies.accessToken;

	if (!accessToken) throw new NoAccessTokenError()

	try {
		req.user = verifyAccessToken(accessToken) as JWTPayload
	} catch (err: any) {
		// `jsonwebtoken`, it throws err.name === 'TokenExpiredError' for expired tokens.
		if (err.name === 'TokenExpiredError') throw new AccessTokenExpiredError()
		throw new AccessTokenInvalidError()
	}
}

export const checkCsrf = async (
	request:FastifyRequest,
	reply: FastifyReply,
) => {
	const csrfCookie = request.cookies.csrfToken;
	const csrfHeader = request.headers['x-csrf-token'];

	if (!csrfCookie || !csrfHeader) throw new NoCSRFTokenError()
	if (csrfCookie !== csrfHeader) throw new CsrfMismatchError()
}

export const handleRefresh = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) throw new NoRefreshTokenError()

	try {
		const payload = verifyRefreshToken(refreshToken);
		const accessToken = generateAccessToken(payload);
		const csrfToken = createCsrfToken();

		reply
			.setCookie('accessToken', accessToken, {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15
			})
			.setCookie('csrfToken', csrfToken, {
				httpOnly: false,
				sameSite: 'strict',
				path: '/',
				maxAge: 60 * 15
			})
			.send({ success: true });
	} catch (err) {
		throw err
	}
}
