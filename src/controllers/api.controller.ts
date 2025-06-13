import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload } from "../types/user.types.js";
import { addJobOffer, getJobOffersCount, getJobOffersPaginated, updateJobPost } from "../services/joboffers.services.js";

import { JobOfferRequest } from "../public/types/job-offer.js";
import { addNewApplication, getApplications } from "../services/partner.services.js";

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

export const handleStudentApplicationSubmit = async (
	req: FastifyRequest,
	reply: FastifyReply 
) => {
	try {
		const user = req.user as JWTPayload;
		const { applicationId, cvUrl, clUrl, extraUrls } = req.body as {
			applicationId: string;
			cvUrl: string | null;
			clUrl: string | null;
			extraUrls: string[];
		};

		console.log('Application submitted:', {
			userId: user.id,
			applicationId,
			cvUrl,
			clUrl,
			extraUrls
		});

		if (!applicationId || !cvUrl || !clUrl)
			throw new Error('aplication not valid');

		await addNewApplication(user.id, applicationId, clUrl, cvUrl);

		reply.status(200).send({success: true});
	} catch (error) {
		console.log(`error: ${error}`);
		reply.status(400).send({success: false});
	}
}

export const handleJobOfferSubmit = async (
	req: FastifyRequest,
	reply: FastifyReply 
) => {
	try {
		const data = req.body as JobOfferRequest;
		await addJobOffer(data, req.user.id);
		reply.status(200).send({success: true});
	} catch (error) {
		console.log(`error: ${error}`);
		reply.status(400).send({success: false});
	}
}

export const handleGetApplications = async (
	req: FastifyRequest<{ Body: { jobOfferID: string } }>,
	reply: FastifyReply 
) => {
	try {
		const { jobOfferID } = req.body;

		if (!jobOfferID) {
			return reply.status(400).send({ 
				success: false, 
				error: "jobOfferID is required" 
			});
		}
		const applications = await getApplications(jobOfferID)
		const answer = {
			applications,
			success: true
		};
		reply.status(200).send(answer);
	} catch (error) {
		console.log(`error: ${error}`);
		reply.status(400).send({success: false});
	}
}
