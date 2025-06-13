import { db } from "../db/connections.js"
import { applicationType } from "../public/types/applicants.js"
import { User, userRoles } from "../types/user.types.js"

export const findPartnerByEmail = async (email: string): Promise <User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE email = ? AND role = ?', [email, userRoles.partner], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			}
		)
	})
}

export const getApplications = async (jobOfferID: string): Promise<applicationType[]> => {
	return new Promise((resolve, reject) => {
		db.all<applicationType>(
			`
			SELECT 
				u.first_name || ' ' || u.last_name AS name,
				u.email AS email,
				a.cv AS cv,
				a.cover_letter AS cl,
				a.created_at AS created_at
			FROM applicationPosts a
			JOIN users u ON a.student_id = u.id
			WHERE a.job_id = ?
			ORDER BY a.created_at DESC
			`,
			[jobOfferID],
			(err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			}
		);
	});
};
