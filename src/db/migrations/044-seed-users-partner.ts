import { db } from "../connections.js";
import bcrypt from 'bcrypt'

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const users = [
			{
				uuid: "uuid-partner-1",
				password: 'Password',
				email: 'partner1@company.com',
				company: 'Make',
				role: 2,
			},
			{
				uuid: "uuid-partner-2",
				password: 'Password',
				email: 'partner2@company.com',
				company: 'Make',
				role: 2,
			},
		];

		db.serialize(() => {
			for (const user of users) {
				const hashed = bcrypt.hashSync(user.password, 10);
				db.run(
					`INSERT INTO users (id, company, password_hash, email, role) VALUES (?, ?, ?, ?, ?)`,
					[user.uuid, user.company, hashed, user.email, user.role],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
