import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { handleGetJobs, handleGetUserRole } from "../controllers/api.controller.js"
import { authenticate } from "../controllers/auth.controllers.js"
// import { handleGetJobOffersForStudents } from "../controllers/jobOffers.controller.js"

export const apiRoutes = async (app: FastifyInstance, opts: FastifyPluginOptions) => {

	app.get('/user/role', {
		// schema: auth42CallbackSchema,
		preHandler: [authenticate],
		handler: handleGetUserRole
	})

	app.get('/jobs', {
		// schema: auth42CallbackSchema,
		preHandler: [authenticate],
		handler: handleGetJobs
	})

	// app.get('/student/jobs', {
	// 	preHandler: [authenticate],
	// 	handler: handleGetJobOffersForStudents
	// })

}
