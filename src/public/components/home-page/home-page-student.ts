import { API } from "../../api.js"
import { JobOffer } from "../../types/job-offer.js"
import { JobType } from "../../types/enums.js"
import { jobStatus } from "../../types/jobOffers.types.js";

export class HomePageStudent extends HTMLElement {
	private JobList: Array<JobOffer>;
	JobTypeLabels = {
		[JobType.FullTime]: "Full-time",
		[JobType.PartTime]: "Part-time",
		[JobType.Internship]: "Internship",
		[JobType.WorkingStudent]: "Working Student"
	};

	constructor() {
		super();

		this.JobList = [];
	}

	async connectedCallback() {
		this.render();
		this.loadJobList();

		this.addEventListener('click', this.handleDynamicContent);
		// console.log("USER ROLE:", role)
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleDynamicContent);
	}

	private render() {
		this.innerHTML = `
		<div class="flex gap-2 h-[calc(100dvh-64px)] mx-2">
			<div id="jobList" class="w-[40%] h-full overflow-y-auto space-y-2"></div>
			<div id="jobDetails" class="w-[60%] h-full overflow-y-auto mb-4"></div>
		</div>
		`
	}

	handleDynamicContent = (event: Event) => {
		const target = event.target as HTMLElement;

		const jobElement = target.closest('.tw-list-entry');
		if (jobElement) {
			const jobTitle = jobElement.querySelector('h2')?.textContent;
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
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 m-2 mt-0 w-dhv h-full overflow-y-auto flex flex-col">
				<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${job.title}</h1>
				<div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${this.JobTypeLabels[job.type]}</span>
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${job.location}</span>
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${job.company}</span>
				</div>
				<div class="mb-4">
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Description</h2>
					<p class="text-gray-700 dark:text-gray-300">${job.description}</p>
				</div>
				<div>
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Requirements</h2>
					<p class="text-gray-700 dark:text-gray-300">${job.requirements}</p>
				</div>
				<div class="mt-auto flex-col">
					<div class="text-xs text-gray-400 dark:text-gray-500 text-right mb-2">
						Posted: ${job.created_at instanceof Date ? job.created_at.toLocaleDateString() : new Date(job.created_at).toLocaleDateString()}<br>
						Edited: ${job.updated_at instanceof Date ? job.updated_at.toLocaleDateString() : new Date(job.updated_at).toLocaleDateString()}
					</div>
					<div class="flex justify-center w-full">
						<a href="/application-form/${job.id}" class="tw-btn w-2/5 min-w-[140px] mx-auto" id="apply-btn">Apply Now!</a>
					</div>
				</div>
			</div>
		`;
	}

	async loadJobList() {
		try {
			const data = await API.getJobList(1, 20, jobStatus.draft);
			if (!data.data) throw Error(`fetching job offers failed: ${data.data}`);
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
			jobElement.className = `
				tw-list-entry flex items-center justify-between gap-4
				px-5 py-4
			`.replace(/\s+/g, ' ');

			jobElement.innerHTML = `
				<div class="flex flex-col gap-1 min-w-0">
					<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">${job.title}</h2>
					<p class="text-sm text-gray-600 dark:text-gray-400">${this.JobTypeLabels[job.type]}</p>
					<div class="flex gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
						<span class="truncate">${job.company}</span>
						<span>•</span>
						<span class="truncate">${job.location}</span>
					</div>
				</div>
				<div class="text-xs text-gray-400 whitespace-nowrap ml-4 flex-shrink-0 text-right">
					${job.created_at instanceof Date ? job.created_at.toLocaleDateString() : new Date(job.created_at).toLocaleDateString()}
				</div>
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
