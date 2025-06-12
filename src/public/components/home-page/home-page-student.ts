import { API } from "../../api.js"
import { JobOffer } from "../../types/job-offer.js"
import { JobType } from "../../types/enums.js"

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

		this.JobList = [
			{
				id: "1",
				createdBy: "user123",
				title: "Software Engineer",
				description: "Develop and maintain software applications.",
				requirements: "Bachelor's degree in Computer Science or related field.",
				type: 1, // Full-time
				jobStatus: 0, // Open
				location: "Remote",
				salary: 60000,
				company: "Tech Solutions Inc.",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "2",
				createdBy: "user456",
				title: "Data Analyst",
				description: "Analyze data to help make business decisions.",
				requirements: "Experience with SQL and data visualization tools.",
				type: 2, // Part-time
				jobStatus: 0, // Open
				location: "New York, NY",
				salary: 50000,
				company: "Data Insights LLC",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "3",
				createdBy: "user789",
				title: "Project Manager",
				description: "Oversee projects from inception to completion.",
				requirements: "PMP certification preferred.",
				type: 1, // Full-time
				jobStatus: 0, // Open
				location: "San Francisco, CA",
				salary: 80000,
				company: "Global Projects Corp.",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "4",
				createdBy: "user101",
				title: "UX Designer",
				description: "Design user-friendly interfaces for web applications.",
				requirements: "Experience with Figma and user research.",
				type: 2, // Part-time
				jobStatus: 0, // Open
				location: "Austin, TX",
				salary: 70000,
				company: "Creative Designs Ltd.",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "5",
				createdBy: "user102",
				title: "DevOps Engineer",
				description: "Manage infrastructure and deployment pipelines.",
				requirements: "Experience with AWS and Docker.",
				type: 1, // Full-time
				jobStatus: 0, // Open
				location: "Chicago, IL",
				salary: 75000,
				company: "Cloud Services Co.",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "6",
				createdBy: "user103",
				title: "Marketing Specialist",
				description: "Develop and execute marketing strategies.",
				requirements: "Experience with digital marketing tools.",
				type: 2, // Part-time
				jobStatus: 0, // Open
				location: "Los Angeles, CA",
				salary: 55000,
				company: "Marketing Pros Inc.",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: "7",
				createdBy: "user104",
				title: "Content Writer",
				description: "Create engaging content for blogs and websites.",
				requirements: "Strong writing skills and creativity.",
				type: 2, // Part-time
				jobStatus: 0, // Open
				location: "Remote",
				salary: 40000,
				company: "Content Creators Ltd.",
				createdAt: new Date(),
				updatedAt: new Date()
			}
		];
		this.render();
	}

	async connectedCallback() {
		this.loadJobList();

		this.addEventListener('click', this.handleDynamicContent);
		// console.log("USER ROLE:", role)
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleDynamicContent);
	}

	private render() {
		this.innerHTML = `
		<div class="flex gap-2 h-dvh">
			<div id="jobList" class="w-[40%] h-full overflow-y-auto space-y-2"></div>
			<div id="jobDetails" class="w-[60%] h-full overflow-y-auto"></div>
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
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 m-2 w-dhv h-dhv">
				<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">${job.title}</h1>
				<div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${this.JobTypeLabels[job.type]}</span>
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${job.location}</span>
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">${job.company}</span>
					<span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Salary: €${job.salary}</span>
				</div>
				<div class="mb-4">
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Description</h2>
					<p class="text-gray-700 dark:text-gray-300">${job.description}</p>
				</div>
				<div>
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Requirements</h2>
					<p class="text-gray-700 dark:text-gray-300">${job.requirements}</p>
				</div>
				<div class="mt-6 text-xs text-gray-400 dark:text-gray-500 text-right">
					Posted: ${job.createdAt instanceof Date ? job.createdAt.toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}
				</div>
			</div>
		`;
	}

	async loadJobList() {
		try {
			// const data = await API.getJobList();
			// if (!data.success) throw Error(`fetching friendList data failed: ${data.message}`);
			// this.JobList = data.data;
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
					${job.createdAt instanceof Date ? job.createdAt.toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}
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
