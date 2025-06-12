import { UUID } from "crypto"
import { db } from "../db/connections.js"
import { User } from "../types/user.types.js"

export const findUserByUUID = async (uuid: UUID): Promise<User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE id = ?', [uuid], (err, row) => {
			if (err) return reject(err)
			resolve(row)
		})
	})
}

export const findUserByEmail = async (email: string): Promise <User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			}
		)
	})
}

export const findUserByUsername = (username: string): Promise<User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
}

export const findUserByIntraId = async (id: number): Promise<User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE intra_id = ?', [id], (err, row) => {
			if (err) return reject(err)
			resolve(row)
		})
	})
}

// export const updateUserRole = async (id)
