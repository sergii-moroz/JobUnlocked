import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { handleApproveJob, handleGetApplications, handleGetJobs, handleGetUserRole, handleJobOfferSubmit, handleRejectJob, handleStudentApplicationSubmit, handleUpdateJobOffer } from "../controllers/api.controller.js"
import { authenticate, checkCsrf } from "../controllers/auth.controllers.js"
import { db } from "../db/connections.js"
import { jobStatus } from "../public/types/jobOffers.types.js"

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

	app.get('/user/42/userinfo', {
		handler: handle42UserInfo
	})

	app.post('/update/job/offer', {
		preHandler: [authenticate, checkCsrf],
		handler: handleUpdateJobOffer
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

	app.post('/approve/job/offer',  {
		preHandler: [authenticate],
		handler: handleApproveJob
	})

	app.post('/reject/job/offer',  {
		preHandler: [authenticate],
		handler: handleRejectJob
	})
}
