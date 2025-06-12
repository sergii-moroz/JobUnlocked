import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { handleGetUserRole } from "../controllers/api.controller.js"
import { authenticate } from "../controllers/auth.controllers.js"

export const apiRoutes = async (app: FastifyInstance, opts: FastifyPluginOptions) => {

	app.get('/user/role', {
		// schema: auth42CallbackSchema,
		preHandler: [authenticate],
		handler: handleGetUserRole
	})
}
