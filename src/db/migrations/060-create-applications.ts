import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		db.run(`
			CREATE TABLE IF NOT EXISTS applicationPosts (
				id TEXT PRIMARY KEY NOT NULL,
				student_id TEXT NOT NULL,
				job_id TEXT NOT NULL,
				cover_letter TEXT NOT NULL,
				cv TEXT NOT NULL,
				status INTEGER NOT NULL,
				created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (status) REFERENCES applicationStatus(id),
				FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
			)
		`, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
