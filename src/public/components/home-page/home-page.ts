import { API } from "../../api.js"

export class HomePage extends HTMLElement {

	constructor()
	{
		super()
	}

	async connectedCallback() {
		// const response = await API.getUserRole()
		// console.log("USER ROLE:", response)
		// console.log("USER ROLE:", response.role)
		// this.render(response.role as number)

		try {
			const { role } = await API.getUserRole();
			this.render(role);
		} catch (error) {
			// console.error('Authentication check failed:', error);
			this.render(0); // Fallback to guest view
		}
	}

	disconnectedCallback() {
		//
	}

	private render(role: number) {
		switch (role) {
			case 1:
				this.innerHTML = `<home-page-student></home-page-student>`
				break
			case 2:
				this.innerHTML = `<home-page-partner></home-page-partner>`
				break
			case 3:
				this.innerHTML = `<home-page-staff></home-page-staff>`
				break
			default:
				this.innerHTML = `<unknown-role></unknown-role>`
		}
	}
}
