import { jobStatus } from "../../types/jobOffers.types.js"
import { API } from "../../api.js"

export class HomePageStuff extends HTMLElement {
	constructor()
	{
		super()
	}

	async connectedCallback() {
		const response = await API.getJobList(1, 5, jobStatus.pendingReview)
		console.log(response)
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
