import { UUID } from "crypto";
import { Intra42User } from "../types/42.types.js";
import { userRoles } from "../types/user.types.js";
import { db } from "../db/connections.js";
import { UserNotFoundError } from "../errors/login.errors.js";

export const get42AccessToken = async (code: string) => {
	try {
		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.OAUTH_42_CLIENT_ID,
				client_secret: process.env.OAUTH_42_CLIENT_SECRET,
				code,
				redirect_uri: process.env.OAUTH_42_REDIRECT_URI
			})
		});
		return response.json();
	}
	catch (error) {
		throw error
	}
}

export const get42UserInfo = async (accessToken: string) => {
	const response = await fetch('https://api.intra.42.fr/v2/me', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	return response.json();
}

export const determineUserRole = async (intraUser: Intra42User): Promise<userRoles> => {
	if (intraUser.staff) return userRoles.stuff
	return userRoles.studen
}

export const register42User = async (intraUser: Intra42User, role: userRoles): Promise<UUID> => {
	const id = crypto.randomUUID()

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO users (id, intra_id, email, username, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[id, intraUser.id, intraUser.email, intraUser.login, intraUser.first_name, intraUser.last_name, role],
			function (err) {
				if (err) return reject(err);
				resolve(id)
			}
		);
	});
}

export const updateUserRole = async (userId: UUID, newRole: userRoles): Promise<void> => {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE users SET role = ? WHERE id = ?`,
			[newRole, userId],
			function (err) {
				if (err) return reject(err);
				if (this.changes === 0) {
					reject(new UserNotFoundError());
				} else {
					resolve();
				}
			}
		);
	});
};
