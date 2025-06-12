import {
	InvalidEmailError,
	PasswordMismatchError,
	PasswordMissingUppercaseError,
	PasswordTooLongError,
	PasswordTooShortError,
	PasswordWhitespaceError,
} from "../errors/registration.errors.js";

import { db } from "../db/connections.js";
import { RegisterInputProps } from "../types/auth.types.js";
import { userRoles } from "../types/user.types.js";
import bcrypt from 'bcrypt';
import { UUID } from "crypto";

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
	return bcrypt.compare(plainPassword, hashedPassword);
}

export const validateRegisterInput = (input: RegisterInputProps): RegisterInputProps => {
	let { email, password, repeated } = input

	email.trim()
	password.trim()
	repeated.trim()

	if (!isValidEmail(email)) throw new InvalidEmailError()
	if (password.length < 6) throw new PasswordTooShortError();
	if (password.length > 64) throw new PasswordTooLongError();
	if (/\s+/g.test(password)) throw new PasswordWhitespaceError();
	if (!/[A-Z]/.test(password)) throw new PasswordMissingUppercaseError();

	if (password != repeated) throw new PasswordMismatchError()

	return { email, password, repeated }
}

export const registerPartner = async (email: string, hashedPassword: string): Promise<UUID> => {
	const id = crypto.randomUUID()

	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
			[id, email, hashedPassword, userRoles.partner],
			function (err) {
				if (err) return reject(err);
				resolve(id)
			}
		);
	});
}

const isValidEmail = (email: string): boolean => {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
