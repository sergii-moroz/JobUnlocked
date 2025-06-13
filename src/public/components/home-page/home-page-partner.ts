import { API } from "../../api.js"
import { Router } from "../../router.js";
import { JobType } from "../../types/enums.js";
import { JobOffer } from "../../types/job-offer.js";
import { jobStatus } from "../../types/jobOffers.types.js";

export class HomePageParthner extends HTMLElement {
	private JobList: Array<JobOffer>;
	JobTypeLabels = {
		[JobType.FullTime]: "Full-time",
		[JobType.PartTime]: "Part-time",
		[JobType.Internship]: "Internship",
		[JobType.WorkingStudent]: "Working Student"
	};
	private editingJobId: string | null = null;

	constructor()
	{
		super();
		this.JobList = [];
	}

	async connectedCallback() {
		this.render();

		this.loadJobList();
		this.addEventListener('click', this.handleDynamicContent);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleDynamicContent);
	}

	private render() {
		// <div>
		// 	<a href="/jobOffers" data-link class="tw-btn-outline flex items-center justify-center
		// 	px-5 py-4 w-full mb-2 text-lg font-bold">Create Job Offer</a>
		// <div>
		this.innerHTML = `
		<div class="flex gap-2 h-[calc(100dvh-64px)] mx-2">
			<div id="jobList" class="w-[40%] h-full overflow-y-auto space-y-2"></div>
			<div id="jobDetails" class="w-[60%] overflow-y-auto mb-4"></div>
		</div>
		`
	}

	handleDynamicContent = (event: Event) => {
		const target = event.target as HTMLElement;

		if (target.id === "edit-btn") {
			const jobId = String(target.getAttribute('data-job-id'));
			if (!jobId) return;
			const job = this.JobList.find(j => j.id === jobId);
			if (job) {
				this.editingJobId = job.id;
				this.renderJobEditForm(job);
			}
			return;
		}

		if (target.id === "save-btn") {
			this.saveJobEdits();
			return;
		}

		if (target.id === "cancel-btn") {
			const job = this.JobList.find(j => j.id === this.editingJobId);
			if (job) this.renderJobDetails(job);
			this.editingJobId = null;
			return;
		}

		if (target.id ==="btn-new-job") {
			this.renderJobEditForm(null);
		}

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
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 m-2 mt-0 w-dhv overflow-y-auto flex flex-col">
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
						<button class="tw-btn-outline w-2/6 min-w-[140px] mx-auto" id="edit-btn" data-job-id="${job.id}">Edit</button>
						<a href="/applicant-list/${job.id}" class="tw-btn w-2/6 min-w-[140px] mx-auto" id="view-btn">View applications</a>
					</div>
				</div>
			</div>
		`;
	}

	private renderJobEditForm(job: JobOffer | null) {
		const detailsContainer = this.querySelector('#jobDetails');
		if (!detailsContainer) return;

		detailsContainer.innerHTML = `
			<form id="edit-job-form" class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 m-2 mt-0 w-full h-full flex flex-col">
				<label class="mb-2 text-gray-700 dark:text-gray-200">Title
					<input name="title" class="tw-input w-full" value="${job?.title || ''}" required />
				</label>
				<label class="mb-2 text-gray-700 dark:text-gray-200">Location
					<input name="location" class="tw-input w-full" value="${job?.location || ''}" required />
				</label>
				<label class="mb-2 text-gray-700 dark:text-gray-200">Company
					<input name="company" class="tw-input w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" value="${job?.company || ''}" readonly />
				</label>
				<label class="mb-2 text-gray-700 dark:text-gray-200">Description
					<textarea name="description" class="tw-input w-full" required>${job?.description || ''}</textarea>
				</label>
				<label class="mb-2 text-gray-700 dark:text-gray-200">Requirements
					<textarea name="requirements" class="tw-input w-full" required>${job?.requirements || ''}</textarea>
				</label>
				<div class="mt-auto flex-col">
					<div class="flex justify-center w-full">
						<button type="button" id="save-btn" class="tw-btn w-2/6 min-w-[140px] mx-auto">Save</button>
						<button type="button" id="cancel-btn" class="tw-btn-outline w-2/6 min-w-[140px] mx-auto">Cancel</button>
					</div>
				</div>
			</form>
		`;
	}

	private async saveJobEdits() {
		const form = this.querySelector('#edit-job-form') as HTMLFormElement;
		if (!form) return;
		const formData = new FormData(form);

		if (!this.editingJobId) return;

		const updatedJob = {
			id: this.editingJobId,
			title: (formData.get('title') ?? '') as string,
			location: (formData.get('location') ?? '') as string,
			company: (formData.get('company') ?? '') as string,
			description: (formData.get('description') ?? '') as string,
			requirements: (formData.get('requirements') ?? '') as string,
			// Add other fields as needed
		};

		await API.updateJob(updatedJob); // Implement this in your API
		const jobIndex = this.JobList.findIndex(j => j.id === this.editingJobId);
		if (jobIndex !== -1) this.JobList[jobIndex] = { ...this.JobList[jobIndex], ...updatedJob };
		this.renderJobDetails(this.JobList[jobIndex]);
		this.editingJobId = null;
	}

	private populateJobList() {
		const root = this.querySelector('#jobList');
		if (!root) return;
		root.innerHTML = ``;

		const createBtn = document.createElement('a');
		createBtn.href = "/jobOffers";
		createBtn.setAttribute('data-link', '');
		createBtn.className = `
			tw-btn-outline flex items-center justify-center
			px-5 py-4 w-full mb-2 text-lg font-bold
		`.replace(/\s+/g, ' ');
		createBtn.textContent = "＋ Create Job Offer";
		root.appendChild(createBtn);

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

	async loadJobList() {
		try {
			const data = await API.getJobListInd();
			if (!data.data) throw Error(`fetching job offers failed: ${data.data}`);
			this.JobList = data.data;
			this.JobList = data.data.map((job: any) => ({
				...job,
				created_at: job.created_at ? new Date(job.created_at) : undefined,
				updated_at: job.updated_at ? new Date(job.updated_at) : undefined,
				approval_date: job.approval_date ? new Date(job.approval_date) : undefined,
			}));
			this.populateJobList();
		} catch (error) {
			console.error("Error loading job list:", error);
			this.showErrorState(this.querySelector('#friendList'));
		}
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
