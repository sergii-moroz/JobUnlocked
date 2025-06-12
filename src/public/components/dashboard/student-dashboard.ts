import { InsufficientPermissionError } from "../../../errors/middleware.errors.js"
import { API } from "../../api.js"

export class StudentDashboard extends HTMLElement {
	constructor() {
		super()
	}

	async connectedCallback() {
		const response = await API.getUserRole() // replace with coresponding function
		if (response.success) {
			this.render()
		} else {
			this.insufficientPermission() // or Router.navigateTo('/home')
		}
	}

	disconnectedCallback() {
		//
	}

	private render() {
		this.innerHTML = `
			<h1>Student's Dashboard</h1>
		`
	}

	private insufficientPermission() {
		this.innerHTML = `<h1>InsufficientPermission</h1>`
	}
}
