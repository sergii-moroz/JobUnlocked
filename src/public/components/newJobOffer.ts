export class JobOfferForm extends HTMLElement {
	form: HTMLFormElement | null = null;
	cancel: HTMLElement | null = null;

	constructor() {
		super();
		this.render();
	}

	connectedCallback() {
		this.form = this.querySelector('#job-offer-form');
		this.cancel = this.querySelector('#cancel-btn');
		this.form?.addEventListener('submit', this.submitHandler);
		this.cancel?.addEventListener('click', this.backToHome);
	}

	disconnectedCallback() {
		this.form?.removeEventListener('submit', this.submitHandler);
		this.cancel?.removeEventListener('click', this.backToHome);
	}

	private render() {
		this.innerHTML = `
		<div id='parent' class="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
			<h2 class="text-3xl font-extrabold text-gray-800 text-center mb-3">Post a New Job Offer</h2>
			<p class="text-sm text-gray-600 text-center mb-6">Fill in the details below to publish a job opportunity.</p>

			<form id="job-offer-form" class="space-y-6">

				<!-- Position -->
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
					<input type="text" id="title" name="title" required
						class="w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
				</div>

				<!-- Company Introduction & Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description (Role, Company Introduction, etc.)</label>
					<textarea id="description" name="description" rows="5" required
						class="w-full px-4 py-2 border border-gray-300 text-black not-odd:rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
				</div>

				<!-- Requirements -->
				<div>
					<label for="requirements" class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
					<textarea id="requirements" name="requirements" rows="4"
						class="w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
				</div>

				<!-- Real Location -->
				<div>
					<label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
					<input type="text" id="location" name="location"
						class="w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Berlin, Germany" />
				</div>

				<!-- Work Mode -->
				<div>
					<label for="mode" class="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
					<select id="mode" name="mode"
						class="w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
						<option value="remote">Remote</option>
						<option value="on-site">On-site</option>
						<option value="hybrid">Hybrid</option>
					</select>
				</div>

				<!-- Type of Position -->
				<div>
					<label for="type" class="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
					<select id="type" name="type"
						class="w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
						<option value="job">Job</option>
						<option value="internship">Internship</option>
					</select>
				</div>

				<!-- Buttons -->
				<div class="pt-6 flex justify-between items-center">
					<button type="button" id='cancel-btn'
						class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
						Cancel
					</button>
					<button type="submit"
						class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
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

		const payload = Object.fromEntries(formData.entries());

		try {
			// await API.submitJobOffer(payload)
			this.showSuccess();
			formEl.reset();
		} catch (err) {
			this.showError();
		}
	};

	backToHome = () => {
		// Router.navigateTo("/home");
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
