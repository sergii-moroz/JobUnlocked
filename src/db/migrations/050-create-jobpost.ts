import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		db.run(`
			CREATE TABLE IF NOT EXISTS jobPosts (
				id TEXT PRIMARY KEY NOT NULL,
				partner_id TEXT NOT NULL,
				title TEXT NOT NULL,
				description TEXT NOT NULL,
				requirements TEXT NOT NULL,
				location TEXT NOT NULL,
				type INTEGER NOT NULL,
				job_status INTEGER NOT NULL,
				created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				approved_by TEXT DEFAULT NULL,
				approval_date DATETIME DEFAULT NULL,
				FOREIGN KEY (type) REFERENCES jobType(id),
				FOREIGN KEY (job_status) REFERENCES jobStatus(id),
				FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE CASCADE
			)
		`, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
