import { jobStatus } from "../../types/jobOffers.types.js"
import { API } from "../../api.js"
import { JobType } from "../../types/enums.js"
import { iconChevronLeft, iconChevronRight, iconHomeStats, iconMinus, iconPlus } from "../icons/icons.js";

type JobOffer = {
	id: string
	type: string
	title: string
	description: string
	requirements: string
	approval_date: string
	location: string
	first_name: string
	last_name: string
	company: string
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100] as const

export class HomePageStuff extends HTMLElement {
	private data: JobOffer[] = []
	private currentPage = 1
	private pageSize: typeof PAGE_SIZE_OPTIONS[number] = 5
	private totalItems = 0
	private totalPages = 0
	private isLoading = false
	private selectedJob: JobOffer | null = null

	constructor() {
		super()
	}

	async connectedCallback() {
		await this.loadData()
		// this.render()
		this.setupEventListeners()
		this.setupActionListeners();
	}

	disconnectedCallback() {
		this.cleanupEventListers()
	}

	private async loadData() {
		if (this.isLoading) return

		this.isLoading = true
		this.renderLoading()

		try {
			const response = await API.getJobList(this.currentPage, this.pageSize, jobStatus.pendingReview)
			this.data = response.data
			this.totalItems = response.meta.total
			this.totalPages = response.meta.totalPages
		} catch (error) {
			console.log('Error loading game history:', error)
			this.renderError()
		} finally {
			this.isLoading = false
			console.log(this.data)
			this.render()
		}
	}

	private renderLoading() {
		this.innerHTML = `
			<div class="tw-card p-6">
				<div class="animate-pulse space-y-4">
					<div class="h-6 bg-gray-200 rounded w-1/4"></div>
					<div class="h-4 bg-gray-200 rounded"></div>
					<div class="h-4 bg-gray-200 rounded"></div>
					<div class="h-4 bg-gray-200 rounded w-3/4"></div>
				</div>
			</div>
		`
	}

	private renderError() {
		this.innerHTML = `
			<div class="tw-card p-6 text-red-500">
				Failed to load game history.
				<button id="retry-btn" class="text-blue-500">Retry</button>
			</div>
		`
	}

	private render() {
		const jobList = this.renderJobList()
		const jobDetails = this.renderJobDetails()
		const pagination = this.renderPagination()
		const pageSizeBlock = this.renderPageSize()
		const totalPagesBlock = this.renderTotalPages()

		this.innerHTML = `
			<!-- Header (fixed height) -->
			<div class="p-4 z-10">
				<div class="flex items-center">
					<div class="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4">
						${iconHomeStats}
					</div>
					<h3 class="text-xl font-bold">Pending reviews</h3>
				</div>
			</div>

			<div class="flex">
				<!-- Left sidebar (25% width) - Fixed height container -->
				<div class="w-1/4 flex flex-col h-full">


				<!-- Scrollable job list (flex-1 for remaining space) -->
				<div class="flex-1 overflow-y-auto">
						<div class="flex flex-col gap-2 p-4">
								${jobList}
						</div>
				</div>

				<!-- Pagination (fixed height at bottom) -->
				<div class="p-4 ">
						<div class="flex items-center justify-between">
								${totalPagesBlock}
								${pagination}
								${pageSizeBlock}
						</div>
				</div>
			</div>

			<!-- Main content area (75% width) -->
			<div class="w-3/4 overflow-y-auto mr-4 mt-4">
				${jobDetails}
			</div>
		</div>
	`;

	this.setupJobSelectionListeners();
	}

private renderJobList() {
	if (this.data.length === 0) {
		return `
			<div class="tw-card p-4 text-center text-gray-500">
					No Pending Job Offers found
			</div>
		`;
	}

	return this.data.map(row => {
		const isSelected = this.selectedJob?.id === row.id;
		return `
			<div class="tw-card p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}"
				data-job-id="${row.id}">
				<div class="flex flex-col gap-1">
						<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">${row.title}</h2>
						<p class="text-sm text-gray-600 dark:text-gray-400">${row.type}</p>
						<div class="flex gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
							<span class="truncate">${row.company}</span>
							<span>•</span>
							<span class="truncate">${row.location}</span>
						</div>
				</div>
				<div class="text-xs text-gray-400 whitespace-nowrap ml-4 flex-shrink-0 text-right">
						${this.formatDate(row.approval_date)}
				</div>
			</div>
		`;
	}).join('');
}

	private renderJobDetails() {
		if (!this.selectedJob && this.data.length > 0) {
				this.selectedJob = this.data[0];
		}

		if (!this.selectedJob) {
				return `
						<div class="flex items-center justify-center h-full">
								<div class="text-gray-500">Select a job to view details</div>
						</div>
				`;
		}

		const job = this.selectedJob;
		return `
			<div class="tw-card p-8">
				<div class="max-w-3xl mx-auto">
					<div class="mb-8">
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white">${job.title}</h1>
						<div class="flex items-center gap-4 mt-2">
							<span class="text-blue-600 dark:text-blue-400">${job.company}</span>
							<span class="text-gray-500">•</span>
							<span class="text-gray-600 dark:text-gray-400">${job.location}</span>
							<span class="text-gray-500">•</span>
							<span class="text-gray-600 dark:text-gray-400">${job.type}</span>
						</div>
						<div class="mt-4 text-sm text-gray-500">
							Posted on ${this.formatDate(job.approval_date)}
						</div>
					</div>

					<div class="mb-8">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
						<div class="prose dark:prose-invert max-w-none">
							${job.description}
						</div>
					</div>

					<div class="mb-8">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
						<div class="prose dark:prose-invert max-w-none">
							${job.requirements}
						</div>
					</div>

					<div class="flex gap-4">
						<button id="btn-reject" class="tw-btn-outline" data-job-id="${this.selectedJob.id}">
							Reject
						</button>
						<button id="btn-approve" class="tw-btn" data-job-id="${this.selectedJob.id}">
							Approve
						</button>
					</div>
				</div>
			</div>
		`;
	}

	private setupJobSelectionListeners() {
		const jobCards = this.querySelectorAll('[data-job-id]');
		jobCards.forEach(card => {
			card.addEventListener('click', () => {
				const jobId = card.getAttribute('data-job-id');
				this.selectedJob = this.data.find(job => job.id === jobId) || null;
				this.render();
			});
		});
	}

	private setupActionListeners() {
        // Approve button
        this.querySelector('#btn-approve')?.addEventListener('click', async (e) => {
            const button = e.target as HTMLButtonElement;
            const jobId = button.dataset.jobId;
            if (!jobId) return;

            button.disabled = true;
            button.classList.add('opacity-50');

            try {
                await API.approveOffer(jobId);
                this.removeJobFromList(jobId);
            } catch (error) {
                console.error('Approval failed:', error);
            } finally {
                button.disabled = false;
                button.classList.remove('opacity-50');
            }
        });

        // Reject button
        this.querySelector('#btn-reject')?.addEventListener('click', async (e) => {
            const button = e.target as HTMLButtonElement;
            const jobId = button.dataset.jobId;
            if (!jobId) return;

            button.disabled = true;
            button.classList.add('opacity-50');

            try {
                await API.rejectOffer(jobId);
                this.removeJobFromList(jobId);
            } catch (error) {
                console.error('Rejection failed:', error);
            } finally {
                button.disabled = false;
                button.classList.remove('opacity-50');
            }
        });
    }

    private removeJobFromList(jobId: string) {
        this.data = this.data.filter(job => job.id !== jobId);
        if (this.selectedJob?.id === jobId) {
            this.selectedJob = this.data[0] || null;
        }
        this.render();
    }

	private renderPagination() {
		const totalPages = Math.ceil(this.totalItems / this.pageSize)
		const isFirstPage = this.currentPage === 1
		const isLastPage = this.currentPage >= totalPages

		return `
			<div class="flex items-center justify-center gap-2">
				<button
					class="${ isFirstPage ? 'opacity-50 cursor-not-allowed' : '' }"
					${ isFirstPage ? 'disabled' : '' }
					data-action="prev"
				>
					<div class="size-8 flex items-center hover:bg-gray-500/20 justify-center rounded-full">
						${iconChevronLeft}
					</div>
				</button>

				<div class="size-8 flex items-center bg-blue-500/10 text-blue-500 justify-center rounded-full select-none">
						${this.currentPage}
				</div>

				<button id="btn-next"
					class="${ isLastPage? 'opacity-50 cursor-not-allowed' : '' }"
					${ isLastPage ? 'disabled' : '' }
					data-action="next"
				>
					<div class="size-8 flex items-center hover:bg-gray-500/20 justify-center rounded-full">
						${iconChevronRight}
					</div>
				</button>
			</div>
		`
	}

	private renderPageSize() {
		const canIncrease = this.pageSize < PAGE_SIZE_OPTIONS[PAGE_SIZE_OPTIONS.length - 1] && this.pageSize < this.totalItems
		const canDecrease = this.pageSize > PAGE_SIZE_OPTIONS[0]

		return `
			<span class="flex items-center gap-1 text-xs">
				<button
					class="${!canDecrease ? 'opacity-50 cursor-not-allowed' : ''}"
					${!canDecrease ? 'disabled': 0}
					data-action="page-size-minus"
				>
					<span class="size-6 flex items-center justify-center hover:bg-gray-500/20 rounded-full select-none [&>svg]:size-4 transition-all">
						${iconMinus}
					</span>
				</button>
				<span class="relative size-6 flex items-center bg-blue-500/10 text-blue-500 justify-center rounded-full select-none">
					${this.pageSize}
					<div
						class="absolute
							bottom-2 translate-y-full sm:bottom-auto
							text-nowrap  transition-all text-blue-900 dark:text-blue-100"
					>page size</div>
				</span>
				<button
					class="${!canIncrease ? 'opacity-50 cursor-not-allowed' : ''}"
					${!canIncrease ? 'disabled': ''}
					data-action="page-size-plus"
				>
					<span class="size-6 flex items-center justify-center hover:bg-gray-500/20 rounded-full select-none [&>svg]:size-4 transition-all">
						${iconPlus}
					</span>
				</button>
			</span>
		`
	}

	private renderTotalPages() {
		return `
			<span class="relative ml-6 size-6 flex items-center bg-blue-500/10 text-xs text-blue-500 justify-center rounded-full select-none">
				${this.totalPages}
				<div
					class="absolute
						bottom-2 translate-y-full sm:bottom-auto
						 text-nowrap transition-all text-blue-900 dark:text-blue-100"
				>pages</div>
			</span>
		`
	}

	private formatDate(dateString: string): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}
		return new Date(dateString).toLocaleDateString(undefined, options)
	}

	private setupEventListeners() {
		this.addEventListener('click', (event) => {
			const target = event.target as HTMLElement
			const action = target.closest('[data-action]')?.getAttribute('data-action')

			if (action === 'prev' && this.currentPage > 1) {
				this.currentPage--
				this.loadData()
			} else if (action === 'next') {
				this.currentPage++
				this.loadData()
			} else if (target.id === 'retry-btn') {
				this.loadData()
			} else if (action === 'page-size-plus') {
				this.incPageSize()
			} else if (action === 'page-size-minus') {
				this.decPageSize()
			} else if (action === 'approve') {
				this.approve()
			} else if (action === 'reject') {
				this.reject()
			}
		})
	}

	private cleanupEventListers() {
		this.removeEventListener('click', () => {})
	}

	private incPageSize() {
		const currentIndex = PAGE_SIZE_OPTIONS.indexOf(this.pageSize)
		if (currentIndex < PAGE_SIZE_OPTIONS.length - 1) {
			const oldPageSize = this.pageSize
			this.pageSize = PAGE_SIZE_OPTIONS[currentIndex + 1]
			this.adjustPageForNewPageSize(oldPageSize)
		}
	}

	private decPageSize() {
		const currentIndex = PAGE_SIZE_OPTIONS.indexOf(this.pageSize)
		if (currentIndex > 0) {
			const oldPageSize = this.pageSize
			this.pageSize = PAGE_SIZE_OPTIONS[currentIndex - 1]
			this.adjustPageForNewPageSize(oldPageSize)
		}
	}

	private adjustPageForNewPageSize(oldPageSize: number) {
		// Calculate which item we were viewing at the top of current page
		const firstVisibleItemIndex = oldPageSize * (this.currentPage - 1);

		// Calculate what page this item would be on with the new page size
		const newPage = Math.max(1, Math.floor(firstVisibleItemIndex / this.pageSize) + 1);

		this.currentPage = newPage;

		this.loadData();
	}

	private approve() {
		const response = API.approveOffer("aaa")
	}

	private reject() {

	}
}
