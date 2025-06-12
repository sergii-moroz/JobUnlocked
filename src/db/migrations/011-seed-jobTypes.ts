import { db } from "../connections.js";

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			'intership',
			'job',
		];

		db.serialize(() => {
			for (const item of items) {
				db.run(
					`INSERT OR IGNORE INTO jobType (name) VALUES (?)`,
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
