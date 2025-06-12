import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			'student',
			'partner',
			'staff',
		];

		db.serialize(() => {
			for (const item of items) {
				db.run(
					`INSERT OR IGNORE INTO roles (name) VALUES (?)`,
					[item],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
