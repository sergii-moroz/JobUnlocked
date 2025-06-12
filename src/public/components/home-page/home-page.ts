import { API } from "../../api.js"

export class HomePage extends HTMLElement {

	constructor()
	{
		super()
	}

	async connectedCallback() {
		const response = await API.getUserRole()
		console.log("USER ROLE:", response)
		console.log("USER ROLE:", response.role)
		this.render(response.role as number)
	}

	disconnectedCallback() {
		//
	}

	private render(role: number) {
		this.innerHTML = "other"
		if (role === 1 ) this.innerHTML = `<home-page-student></home-page-student>`
		if (role === 2 ) this.innerHTML = `<home-page-partner></home-page-partner>`
		if (role === 3 ) this.innerHTML = `<home-page-staff></home-page-staff>`

	}
}
