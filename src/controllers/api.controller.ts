import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload, userRoles } from "../types/user.types.js";
import { addJobOffer, approveJob, getJobOffersCount, getJobOffersInd, getJobOffersPaginated, rejectJob, updateJobPost } from "../services/joboffers.services.js";

import { JobOfferRequest } from "../public/types/job-offer.js";
import { addNewApplication, getApplications } from "../services/partner.services.js";
import { InsufficientPermissionError } from "../errors/middleware.errors.js";
import { sendEmail } from "../services/email.service.js";

import {
	determineUserRole,
	get42AccessToken,
	get42UserInfo,
} from "../services/42.services.js";

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

export const handle42UserInfo = async (
	req:		FastifyRequest<{ Querystring: { code: string } }>,
	reply:	FastifyReply
) => {
	try {
		if(!req.cookies.access_token_42) {
			return reply.status(401).send({ success: false, error: "Unauthorized" });
		}
		const userInfo = await get42UserInfo(req.cookies.access_token_42);
		reply.send({
			success: true,
			data: userInfo
		});
	} catch (error) {
		throw error
	}
}


export const handleUpdateJobOffer = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	try {
		if (req.user.role !== userRoles.partner) throw new InsufficientPermissionError();
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
		if (req.user.role !== userRoles.studen) throw new InsufficientPermissionError();
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
			throw new Error('application not valid');

		await addNewApplication(user.id, applicationId, clUrl, cvUrl);
		// Fetch partner info
		const partnerInfo = await getJobPostPartnerInfo(applicationId);
		// Create formatted email content with clickable links
            const partnerEmailBody = `
				<h3>Dear Partner,</h3>

				<p>A new application has been submitted by ${user.id} for job ${applicationId}.</p>

				<p>Please review the application documents:</p>

				<ul>
					<li>📄 CV: <a href="${cvUrl}" target="_blank">Download CV</a></li>
					<li>📝 Cover Letter: <a href="${clUrl}" target="_blank">Download Cover Letter</a></li>
				</ul>

				<p>Please check your dashboard to review the complete application.</p>

				<p>Best regards,</p>
				<p>JobUnlocked Team</p>
			`.trim();

			const studentEmailBody = `
				<h3>Dear ${user.id},</h3>

				<p>Your application for job ${applicationId} has been successfully submitted!</p>

				<p>Your submitted documents:</p>
				<ul>
					<li>📄 CV: <a href="${cvUrl}" target="_blank">View your CV</a></li>
					<li>📝 Cover Letter: <a href="${clUrl}" target="_blank">View your Cover Letter</a></li>
				</ul>

				<p>We will notify you once it's reviewed.</p>

				<p>Best regards,</p>
				<p>JobUnlocked Team</p>
			`.trim();

		// Send email notifications
		try {
			// Send notification to admin/partner (replace with actual partner email)
			await sendEmail(
				"olanokhin@gmail.com", // Replace with actual partner email
				"New Job Application Received",
				partnerEmailBody
			);
			
			// Send confirmation to student
			await sendEmail(
				"olanokhin@gmail.com",
				"Application Submitted Successfully",
				studentEmailBody
			);

			console.log('Email notifications sent successfully');
		} catch (emailError) {
			console.error('Failed to send email notifications:', emailError);
			// Don't fail the entire request if emails fail
		}

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
		if (req.user.role !== userRoles.partner) throw new InsufficientPermissionError();
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
		if (req.user.role !== userRoles.partner) throw new InsufficientPermissionError();
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


export const handleApproveJob = async (
	req: FastifyRequest<{ Body: { jobOfferID: string } }>,
	reply: FastifyReply
) => {
	try {
		if (req.user.role !== userRoles.stuff) throw new InsufficientPermissionError();
		const { jobOfferID } = req.body;
		console.log("jobid: ", jobOfferID);
		console.log(req.user.id);
		if (!jobOfferID) {
			return reply.status(400).send({
				success: false,
				error: "jobOfferID is required"
			});
		}

		await approveJob(jobOfferID, req.user.id);
		const answer = {
			success: true
		};
		reply.status(200).send(answer);
	} catch (error) {
		console.log(`error: ${error}`);
		reply.status(400).send({success: false});
	}
}

export const handleRejectJob = async (
	req: FastifyRequest<{ Body: { jobOfferID: string } }>,
	reply: FastifyReply
) => {
	try {
		if (req.user.role !== userRoles.stuff) throw new InsufficientPermissionError();
		const { jobOfferID } = req.body;
		console.log("jobid: ", jobOfferID);
		console.log(req.user.id);
		if (!jobOfferID) {
			return reply.status(400).send({
				success: false,
				error: "jobOfferID is required"
			});
		}

		await rejectJob(jobOfferID, req.user.id);
		const answer = {
			success: true
		};
		reply.status(200).send(answer);
	} catch (error) {
		console.log(`error: ${error}`);
		reply.status(400).send({success: false});
	}
}


import { db } from "../db/connections.js";
export const getJobPostPartnerInfo = async (
			jobId: string
			): Promise<{ partner_id: string; email: string } | null> => {
			return new Promise((resolve, reject) => {
				db.get<{ partner_id: string; email: string }>(
				`SELECT
					jp.partner_id,
					u.email
				FROM jobPosts jp
				JOIN users u ON jp.partner_id = u.id
				WHERE jp.id = ?`,
				[jobId],
				(err, row) => {
					if (err) {
					console.error('Database error:', err);
					return reject(new Error('Failed to fetch partner info'));
					}
					resolve(row || null);
				}
				);
			});
			};

export const handleGetOwnJobOffers = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	try {
		console.log(req.user.id);
		const jobOffers = await getJobOffersInd(req.user.id);
		console.log("Total:", jobOffers)
		const replyData = {
			data: jobOffers,
		}
		reply.send(replyData)
	} catch (err) {
		throw err
	}
}

