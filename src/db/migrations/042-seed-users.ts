import { db } from "../connections.js";
import bcrypt from 'bcrypt'

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const users = [
			{
				username: 'olanokhi',
				password: 'password',
				email: 'olanokhi@email.com',
				role: 1,
			},
			{
				username: 'tecker',
				password: 'password',
				email: 'tecker@email.com',
				role: 1,
			},
		];

		db.serialize(() => {
			for (const user of users) {
				const hashed = bcrypt.hashSync(user.password, 10);
				const uuid = crypto.randomUUID()
				db.run(
					`INSERT INTO users (id, username, password_hash, email, role) VALUES (?, ?, ?, ?, ?)`,
					[uuid, user.username, hashed, user.email, user.role],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
