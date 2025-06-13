import { API } from "../api.js";
import { JobType } from "../types/enums.js";
import { JobOfferRequest } from "../types/job-offer.js";

export class JobOfferForm extends HTMLElement {
	form: HTMLFormElement | null = null;

	constructor() {
		super();
		this.render();
	}

	connectedCallback() {
		this.form = this.querySelector('#job-offer-form');
		this.form?.addEventListener('submit', this.submitHandler);
	}

	disconnectedCallback() {
		this.form?.removeEventListener('submit', this.submitHandler);
	}

	private render() {
		this.innerHTML = `
		<div id='parent' class="tw-card max-w-2xl mx-auto mt-12 p-8 rounded-2xl border border-gray-100 bg-white dark:bg-gray-800 shadow-xl dark:shadow-none">
			<h2 class="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-3">Post a New Job Offer</h2>
			<p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">Fill in the details below to publish a job opportunity.</p>

			<form id="job-offer-form" class="flex flex-col gap-4">

				<!-- Position -->
				<div>
					<label for="title" class="mb-2 text-gray-700 dark:text-gray-200">Job Title</label>
					<input type="text" id="title" name="title" required
						class="tw-input w-full" />
				</div>

				<!-- Company Introduction & Description -->
				<div>
					<label for="description" class="mb-2 text-gray-700 dark:text-gray-200">Description (Role, Company Introduction, etc.)</label>
					<textarea id="description" name="description" rows="5" required
						class="tw-input w-full"></textarea>
				</div>

				<!-- Requirements -->
				<div>
					<label for="requirements" class="mb-2 text-gray-700 dark:text-gray-200">Requirements</label>
					<textarea id="requirements" name="requirements" rows="4"
						class="tw-input w-full"></textarea>
				</div>

				<!-- Real Location -->
				<div>
					<label for="location" class="mb-2 text-gray-700 dark:text-gray-200">Location(on-site or remote in brackets)</label>
					<input type="text" id="location" name="location"
						class="tw-input w-full" placeholder="e.g. Berlin, Germany" />
				</div>

				<!-- Type of Position -->
				<div>
					<label for="type" class="mb-2 text-gray-700 dark:text-gray-200">Position Type</label>
					<select id="type" name="type"
						class="tw-input w-full bg-white dark:bg-gray-700">
						<option value="1">FullTime</option>
						<option value="2">PartTime</option>
						<option value="3">Internship</option>
						<option value="4">WorkingStudent</option>
					</select>
				</div>

				<!-- Buttons -->
				<div class="flex justify-center gap-4 mt-6">
					<a href="/home" data-link class="tw-btn-outline w-2/6 min-w-[140px] text-center">Cancel</a>
					<button type="submit" class="tw-btn w-2/6 min-w-[140px] text-center">
						Post Offer
					</button>
				</div>
			</form>
		</div>
		`;
	}

	submitHandler = async (e: Event) => {
		e.preventDefault();
		const formEl = e.target as HTMLFormElement;
		const formData = new FormData(formEl);

		// const payload = Object.fromEntries(formData.entries());
		const payload: JobOfferRequest = {
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			requirements: formData.get("requirements") as string,
			location: formData.get("location") as string,
			type: parseInt(formData.get("type") as string) as JobType,
		}

		try {
			await API.submitJobOffer(payload)
			this.showSuccess();
		} catch (err) {
			this.showError();
		}
	};

	showSuccess() {
		const root = this.querySelector('#parent');
		if (root) {
			root.innerHTML = `
				<div class="text-center py-8">
					<h2 class="text-xl font-bold text-green-600 mb-2">Job Offer Posted!</h2>
					<p class="text-black">Your listing will be reviewed by the 42 staff. This may take some time.<br>
						You’ll be notified once it's approved and published.</p>
					<a href="/home" data-link class="text-black">Back to Home</a>
				</div>
			`;
		}
	}

	showError() {
		const root = this.querySelector('#parent');
		if (root) {
			root.innerHTML = `
				<div class="text-center py-8">
					<h2 class="text-xl font-bold text-red-500 mb-2">Post Failed!</h2>
					<p class="text-black">Please try again</p>
					<a href="/home" data-link class="text-black">Back to Home</a>
				</div>
			`;
		}
	}
}
