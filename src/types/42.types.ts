import { userRoles } from "./user.types.js"

export interface Intra42User {
	id: number
	email: string
	login: string
	first_name: string
	last_name: string
	role?: userRoles
	staff?: boolean
}
