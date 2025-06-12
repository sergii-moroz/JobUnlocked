import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			{
				student_id: "uuid-student-1",
				job_id: "uuid-job-1",
				cover_letter: 'path_to_cover_letter',
				cv: 'path_to_cv',
				status: 1,
			},
		];

		db.serialize(() => {
			for (const item of items) {
				const uuid = crypto.randomUUID()
				db.run(
					`INSERT INTO applicationPosts (id, student_id, job_id, cover_letter, cv, status) VALUES (?, ?, ?, ?, ?, ?)`,
					[uuid, item.student_id, item.job_id, item.cover_letter, item.cv, item.status],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
