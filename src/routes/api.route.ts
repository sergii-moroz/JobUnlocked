import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { handleGetApplications, handleGetJobs, handleGetUserRole, handleJobOfferSubmit, handleStudentApplicationSubmit } from "../controllers/api.controller.js"
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

	app.post('/student/submitApplicationForm', {
		preHandler: [authenticate],
		handler: handleStudentApplicationSubmit
	})

	app.post('/company/submitJobOffer', {
		preHandler: [authenticate],
		handler: handleJobOfferSubmit
	})

	app.post('/company/getApplications', {
		preHandler: [authenticate],
		handler: handleGetApplications
	})
}
