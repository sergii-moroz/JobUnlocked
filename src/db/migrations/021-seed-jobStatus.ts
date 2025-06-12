import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			'draft',
			'panding_review',
			'approved',
			'rejected'
		];

		db.serialize(() => {
			for (const item of items) {
				db.run(
					`INSERT OR IGNORE INTO jobStatus (name) VALUES (?)`,
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
