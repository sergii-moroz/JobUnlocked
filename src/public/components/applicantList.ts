import { API } from "../api.js"
import { applicationType } from "../types/applicants.js";

export class applicantList extends HTMLElement {
	private applications: Array<applicationType>;

	constructor() {
		super();

		this.applications = [];
	}

	async connectedCallback() {
		console.log("aa");
		this.render();
		this.loadApplicantList();

		this.addEventListener('click', this.handleDynamicContent);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleDynamicContent);
	}

	private render() {
		this.innerHTML = `
		<div class="flex gap-2 h-[calc(100dvh-64px)] mx-2">
			<div id="applicantList" class="w-[40%] h-full overflow-y-auto space-y-2"></div>
			<div id="applicantDetails" class="w-[60%] h-full overflow-y-auto mb-4"></div>
		</div>
		`
	}

	handleDynamicContent = (event: Event) => {
		const target = event.target as HTMLElement;

		const applicantElement = target.closest('.tw-list-entry');
		if (applicantElement) {
			const applicantName = applicantElement.querySelector('h2')?.textContent;
			const application = this.applications.find(applicant => applicant.name === applicantName);
			console.log(applicantName);
			console.log(application);
			if (application && applicantName) {
				this.renderApplicationDetails(application);
			}
		}
	}

	private renderApplicationDetails(application: applicationType) {
	const detailsContainer = this.querySelector('#applicantDetails');
	if (!detailsContainer) return;

	detailsContainer.innerHTML = `
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 m-2 mt-0 w-dhv h-full overflow-y-auto flex flex-col">
			<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${application.name}</h1>
			
			<div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
				<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${application.email}</span>
				<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Submitted on: ${application.created_at}</span>
			</div>

			<div>
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">CoverLetter</h2>
				${application.cl ? `<a href="${application.cl}" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400">
										View CoverLetter
									</a>`
								: '<p class="text-gray-500 dark:text-gray-400">No CoverLetter found.</p>'
				}
			</div>

			<div>
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">CV</h2>
				${application.cv ? `<a href="${application.cv}" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400">
										View CV
									</a>`
								: '<p class="text-gray-500 dark:text-gray-400">No CV found.</p>'
				}
			</div>
		</div>
	`;
}


	async loadApplicantList() {
		try {
			const pathParts = window.location.pathname.split("/");
			const jobOfferID = pathParts[pathParts.length - 1];
			const data = await API.getApplications(jobOfferID);
			if (!data.success) throw Error(`fetching job offers failed`);
			this.applications = data.applications;
			this.populateApplicantList();
		} catch (error) {
			console.error("Error loading job list:", error);
			this.showErrorState(this.querySelector('#friendList'));
		}
	}

	private populateApplicantList() {
		const root = this.querySelector('#applicantList');
		if (!root) return;
		root.innerHTML = ``;


		this.applications.forEach((applicant: applicationType) => {
			const applicantElement = document.createElement('div');
			applicantElement.className = `
				tw-list-entry flex items-center justify-between gap-4
				px-5 py-4
			`.replace(/\s+/g, ' ');

			applicantElement.innerHTML = `
				<div class="flex flex-col gap-1 min-w-0">
					<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">${applicant.name}</h2>
				</div>
				<div class="text-xs text-gray-400 whitespace-nowrap ml-4 flex-shrink-0 text-right">
					${applicant.created_at}
				</div>
			`;
			root.appendChild(applicantElement);
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
