import { db } from "../connections.js";
import bcrypt from 'bcrypt'

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const users = [
			{
				uuid: "uuid-student-1",
				first_name: 'Tim',
				last_name: 'brown',
				username: 'student1',
				password: 'Password',
				email: 'student1@student.42heilbronn.com',
				role: 1,
			},
		];

		db.serialize(() => {
			for (const user of users) {
				const hashed = bcrypt.hashSync(user.password, 10);
				const uuid = crypto.randomUUID()
				db.run(
					`INSERT INTO users (id, username, first_name, last_name, password_hash, email, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
					[user.uuid, user.username, user.first_name, user.last_name, hashed, user.email, user.role],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
