import { API } from "../../api.js"
import { JobOffer } from "../../types/job-offer.js"

export class HomePageStudent extends HTMLElement {
	private JobList: Array<JobOffer>;

	constructor() {
		super();
		this.JobList = [];
		this.render();
	}

	async connectedCallback() {
		this.loadJobList();

		this.addEventListener('click', this.handleDynamicContent);
		// console.log("USER ROLE:", role)
	}

	disconnectedCallback() {
		//
	}

	private render() {
		this.innerHTML = `
		<div class="flex gap-6">
			<div id="jobList" class="w-[40%] space-y-4"></div>
			<div id="jobDetails" class="w-[60%] bg-red-100"></div>
		</div>
		`
	}

	handleDynamicContent = (event: Event) => {
		const target = event.target as HTMLElement;

		const jobElement = target.closest('.tw-list-entry');
		if (jobElement) {
			const jobTitle = jobElement.querySelector('h3')?.textContent;
			const jobInstance = this.JobList.find(job => job.title === jobTitle);
			if (jobInstance && jobTitle) {
				this.renderJobDetails(jobInstance);
			}
		}
	}

	private renderJobDetails(job: JobOffer) {
		const detailsContainer = this.querySelector('#jobDetails');
		if (!detailsContainer) return;

		detailsContainer.innerHTML = `
			<h1>${job.title}</h1>
			<p><strong>Type:</strong> ${job.type}</p>
			<p><strong>Location:</strong> ${job.location}</p>
			<p><strong>Salary:</strong> ${job.salary}</p>
			<p><strong>Company:</strong> ${job.company}</p>
			<p> ${job.description}</p>
			<p><strong>Requirements:</strong> ${job.requirements}</p>
		`;
	}

	async loadJobList() {
		try {
			const data = await API.getJobList();
			if (!data.success) throw Error(`fetching friendList data failed: ${data.message}`);
			this.JobList = data.data;
			this.populateJobList();
		} catch (error) {
			console.error("Error loading job list:", error);
			this.showErrorState(this.querySelector('#friendList'));
		}
	}

	private populateJobList() {
		const root = this.querySelector('#jobList');
		if (!root) return;
		root.innerHTML = ``;

		this.JobList.forEach((job: JobOffer) => {
			const jobElement = document.createElement('div');
			jobElement.className = 'tw-list-entry';
			jobElement.innerHTML = `
				<h3>${job.title}</h3>
				<p>${job.company}</p>
				<p>${job.type}</p>
				<p>${job.location}</p>
			`;
			root.appendChild(jobElement);
		});

	}

	showErrorState(element: HTMLElement | null) {
		if (!element) return;
		element.innerHTML = `
		<div class="flex items-center justify-center h-full min-h-screen">
		<h2 class="text-red-500">Failed to load data</h2>
			</div>
		`;
	}
}
