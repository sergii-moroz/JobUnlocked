import {
	FastifyInstance,
	FastifyPluginOptions,
} from "fastify";

import {
	authenticate,
	checkCsrf,
	handle42Login,
	handleLogout,
	handlePartnerLogin,
	handlePartnerRegister,
	handleRefresh
} from "../controllers/auth.controllers.js";

import {
	auth42CallbackSchema,
	loginSchema,
	logoutSchema,
	registerSchema
} from "../schemas/auth.schema.js";

export const authRoutes = async (app: FastifyInstance, opts: FastifyPluginOptions) => {

	app.get('/42/callback', {
		schema: auth42CallbackSchema,
		handler: handle42Login
	})

	app.post('/partner/register', {
		schema: registerSchema,
		handler: handlePartnerRegister
	})

	app.post('/partner/login', {
		schema: loginSchema,
		handler: handlePartnerLogin
	})

	app.post('/logout', {
		schema:			logoutSchema,
		preHandler:	[authenticate, checkCsrf],
		handler:		handleLogout
	})

	app.post('/refresh', {
		handler: handleRefresh
	});

}
