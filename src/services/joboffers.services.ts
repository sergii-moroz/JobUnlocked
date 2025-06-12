import { db } from "../db/connections.js"
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
