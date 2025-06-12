import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		db.run(`
			CREATE TABLE IF NOT EXISTS users (
				id TEXT PRIMARY KEY NOT NULL,
				intra_id TEXT UNIQUE DEFAULT NULL,	-- student or stuff
				username TEXT UNIQUE DEFAULT NULL,	-- student or stuff
				email TEXT UNIQUE NOT NULL,
				role INTEGER NOT NULL,
				password_hash TEXT DEFAULT NULL,		-- partner only
				company STRING DEFAULT NULL,				-- partner only
				first_name STRING DEFAULT NULL,
				last_name STRING DEFAULT NULL,
				created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (role) REFERENCES roles(id)
			)
		`, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
