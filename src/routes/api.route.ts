import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { authenticate, checkCsrf } from "../controllers/auth.controllers.js"
import { handleGetJobs, handleGetUserRole, handleJobOfferSubmit, handleStudentApplicationSubmit, handleUpdateJobOffer } from "../controllers/api.controller.js"
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

	app.post('/approve/job/offer', {preHandler: [authenticate, checkCsrf]}, async (req, reply) => {
		const { id } = req.params as {id: any}
    try {
        await db.run(`
            UPDATE jobPosts
            SET job_status = ?, approved_by = ?, approval_date = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [jobStatus.approved, req.user.id, id]);
        return { success: true };
    } catch (error) {
        reply.status(500).send({ error: 'Failed to approve job' });
    }
	})
}
