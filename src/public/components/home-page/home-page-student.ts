import { API } from "../../api.js"

export class HomePageStudent extends HTMLElement {
	constructor()
	{
		super()
	}

	async connectedCallback() {
		const response = await API.getJobs()
		console.log("RESPONSE", response)

		this.render()
	}

	disconnectedCallback() {
		//
	}

	private render() {
		this.innerHTML = `
			I'm student
		`
	}
}
