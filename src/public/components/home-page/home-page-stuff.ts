import { API } from "../../api.js"

export class HomePageStuff extends HTMLElement {
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
			I'm stuff
		`
	}
}
