import { API } from "../../api.js"

export class HomePageParthner extends HTMLElement {
	constructor()
	{
		super()
	}

	async connectedCallback() {
		// const role = await API.getUserRole()
		// console.log("USER ROLE:", role)
		this.render()
	}

	disconnectedCallback() {
		//
	}

	private render() {
		this.innerHTML = `
		<home-header></home-header>
			I'm partner
		`
	}
}
