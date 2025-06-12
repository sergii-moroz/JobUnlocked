import { db } from "../connections.js";
import bcrypt from 'bcrypt'

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const users = [
			{
				uuid: "uuid-student-1",
				username: 'student1',
				password: 'Password',
				email: 'student1@student.42heilbronn.com',
				role: 1,
			},
			{
				uuid: "uuid-stuff1",
				username: 'stuff1',
				password: 'Password',
				email: 'stuff1@42heilbronn.com',
				role: 3,
			},
		];

		db.serialize(() => {
			for (const user of users) {
				const hashed = bcrypt.hashSync(user.password, 10);
				db.run(
					`INSERT INTO users (id, username, password_hash, email, role) VALUES (?, ?, ?, ?, ?)`,
					[user.uuid, user.username, hashed, user.email, user.role],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
