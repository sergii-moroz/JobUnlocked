import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload } from "../types/user.types.js";
import { getJobOffersCount, getJobOffersPaginated, updateJobPost } from "../services/joboffers.services.js";
import { jobStatus } from "../public/types/jobOffers.types.js";

export const handleGetUserRole = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	const user = req.user as JWTPayload
	console.log("USER", user)
	reply.send({success: true, role: user.role })
}

export const handleGetJobs = async (
	req:		FastifyRequest<{
		Querystring: {
			page?: string
			page_size?: string
			job_status?: string
		}
	}>,
	reply:	FastifyReply
) => {
	try {
		console.log("handleGetJobOffers")
		const user = req.user as JWTPayload
		const page = parseInt(req.query.page || '1')
		const pageSize = parseInt(req.query.page_size || '5')
		const job_status = parseInt(req.query.job_status || '1')
		const jobOffers = await getJobOffersPaginated(page, pageSize, job_status)
		const total = await getJobOffersCount(job_status)
		console.log("Total:", total)
		const replyData = {
			data: jobOffers,
			meta: {
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize)
			}
		}
		reply.send(replyData)
	} catch (err) {
		throw err
	}
}

export const handleUpdateJobOffer = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	try {
		const { job } = req.body as any
		console.log("id", req.body)
		const user = req.user as JWTPayload
		const jobOffers = await updateJobPost(job.id, job.title, job.description, job.location, job.requirements)
		reply.send({
			success: true,
			message: "Job post updated successfully"
		})
	} catch (error) {
		throw error
	}
}
