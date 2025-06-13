import { db } from "../db/connections.js"
import { JobOfferRequest } from "../public/types/job-offer.js"
import { jobStatus } from "../public/types/jobOffers.types.js"

interface JobOffersProps {
	id: string,
	partner_name: string,
	title: string,
	description: string,
	requirements: string,
	location: string,
	type: string,
	updated_at: string
}

export const getJobOffersCount = async (status: number): Promise<number> => {
	return new Promise((resolve, reject) => {
		const sql = `
			SELECT COUNT(*) as count
			FROM jobPosts
			WHERE job_status = ?
		`

		db.get<{count: number}>(sql, [status], (err, row) => {
			if (err) return reject(err)
			resolve(row?.count || 0)
		})
	})
}

export const getJobOffersPaginated = async (
	page: number = 1,
	pageSize: number = 5,
	job_status: jobStatus
): Promise<JobOffersProps[]> => {
	return new Promise((resolve, reject) => {
		const offset = (page - 1) * pageSize

		const sql = `
			SELECT
				jp.id,
				jp.type,
				jp.title,
				jp.description,
				jp.requirements,
				jp.approval_date,
				jp.location,
				p.first_name,
				p.last_name,
				p.company
			FROM jobPosts jp
			JOIN users p ON jp.partner_id = p.id
			WHERE jp.job_status = ?
			ORDER BY jp.approval_date DESC
			LIMIT ? OFFSET ?
		`

		db.all<JobOffersProps>(sql, [job_status, pageSize, offset], (err, rows) => {
				if (err) return reject(err)
				resolve(rows)
			}
		)
	})
}

export const approveJobOffer = async (
	id: string,
	approval: string
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const sql = `UPDATE jobPosts SET approved_by = ?, approval_date = ? WHERE id = ?`
		db.run(sql, [approval, id], function(err) {
			if (err) return reject(err);
			if (this.changes === 0) {
				reject(new Error(`No job post found with id ${id}`));
			} else {
				resolve();
			}
		});
	})
}

export const updateJobPost = async (
	id: string,
	title: string,
	description: string,
	location: string,
	requirements: string
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const sql = `
				UPDATE jobPosts SET title = ?, description = ?, location = ?, requirements = ?
				WHERE id = ?
		`;

		db.run(sql, [title, description, location, requirements, id], function(err) {
			if (err) return reject(err);
			if (this.changes === 0) {
				reject(new Error(`No job post found with id ${id}`));
			} else {
				resolve();
			}
		});
	});
};

export const addJobOffer = async (jobOffer: JobOfferRequest, user_id: string): Promise<void> => {
	const id = crypto.randomUUID()

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO jobPosts (id, partner_id, title, description, requirements, location, type, job_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[id, user_id, jobOffer.title, jobOffer.description, jobOffer.requirements, jobOffer.location, jobOffer.type, jobStatus.draft],
			function (err) {
				if (err) return reject(err);
				resolve();
			}
		);
	});
}

export const approveJob = async (jobOfferID: string, user_id: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE jobPosts SET job_status = ?, approved_by = ?, approval_date = CURRENT_TIMESTAMP WHERE id = ?`,
			[jobStatus.approved, user_id, jobOfferID],
			function (err) {
				if (err) reject(err);
				resolve();
			}
		);
	});
}

export const rejectJob = async (jobOfferID: string, user_id: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE jobPosts SET job_status = ?, approved_by = ?, approval_date = CURRENT_TIMESTAMP WHERE id = ?`,
			[jobStatus.rejected, user_id, jobOfferID],
			function (err) {
				if (err) reject(err);
				resolve();
			}
		);
	});
}
