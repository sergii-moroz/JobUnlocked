import { db } from "../db/connections.js"
import { User, userRoles } from "../types/user.types.js"

export const findPartnerByEmail = async (email: string): Promise <User | undefined> => {
	return new Promise((resolve, reject) => {
		db.get<User>('SELECT * FROM users WHERE email = ? AND role = ?', [email, userRoles.partner], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			}
		)
	})
}
