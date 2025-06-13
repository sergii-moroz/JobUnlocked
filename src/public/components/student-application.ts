import { API } from "../api.js";
import { Router } from "../router.js";

export class ApplicationForm extends HTMLElement {
	form: HTMLFormElement | null = null;

    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
		this.form = this.querySelector('#application-form');
        this.form?.addEventListener('submit', this.submitHandler);
    }

	disconnectedCallback() {
		this.form?.removeEventListener('submit', this.submitHandler);
	}

    private render() {
        this.innerHTML = `
			<div id='parent' class="tw-card max-w-xl mx-auto mt-12 p-8 rounded-2xl border border-gray-100 bg-white dark:bg-gray-800 shadow-xl dark:shadow-none">
				<h2 class="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-3">Apply for the position</h2>
				<p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
					Please upload your documents below. <br>Submitting this form is your official application.
				</p>

				<form id="application-form" class="flex flex-col gap-4" enctype="multipart/form-data">

					<!-- CV Upload -->
					<label class="mb-2 text-gray-700 dark:text-gray-200">CV
						<input type="file" id="cv" name="cv" accept=".pdf" required
							class="tw-input w-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800" />
					</label>

					<!-- Cover Letter Upload -->
					<label class="mb-2 text-gray-700 dark:text-gray-200">Cover Letter
						<input type="file" id="cl" name="cl" accept=".pdf" required
							class="tw-input w-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800" />
					</label>

					<!-- Extra Files Upload -->
					<label class="mb-2 text-gray-700 dark:text-gray-200">Additional Documents
						<input type="file" id="extra" name="extra" accept=".pdf" multiple
							class="tw-input w-full file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700" />
					</label>

					<!-- Buttons -->
					<div class="flex justify-center gap-4 mt-6">
						<a href="/home" data-link class="tw-btn-outline w-2/6 min-w-[140px] text-center">Cancel</a>
						<button type="submit" class="tw-btn w-2/6 min-w-[140px] text-center">
							Submit
						</button>
					</div>
				</form>

				<!-- Notes -->
				<div class="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400 text-center italic">
					<p>📌 Only PDF files are accepted. Please ensure your uploads are in .pdf format.</p>
					<p>🔒 Your personal information (name, email, etc.) is automatically imported from your Intra profile. Make sure it’s up to date before applying.</p>
				</div>
			</div>
        `;
    }

    submitHandler = async (e: Event) => {
		e.preventDefault();
		const formEl = e.target as HTMLFormElement
		const formData = new FormData(formEl)

		const pathParts = window.location.pathname.split("/");
		const applicationId = pathParts[pathParts.length - 1];
		formData.append("applicationId", applicationId);

		try {
			const res = await API.submitStudentApplication(formData)
			if (!res.success) throw new Error;
			this.showSuccess();
		} catch (err) {
			this.showError();
		}
	}

    showSuccess() {
		const root = this.querySelector('#parent');
		if (root)
		{
            root.innerHTML = `
                <div class="text-center py-8">
                    <h2 class="text-xl font-bold text-green-600 mb-2">Application Submitted!</h2>
                    <p>Thank you for your application.</p>
					<a href="/home" data-link class="text-black">Home</a>
                </div>
            `;
		}
    }

    showError() {
		const root = this.querySelector('#parent');
		if (root)
		{
            root.innerHTML = `
				<div class="text-center py-8">
                    <h2 class="text-xl font-bold text-red-500 mb-2">Submit Failed!</h2>
                    <p>Please try again</p>
					<a href="/home" data-link class="text-black">Home</a>
                </div>
			`
        }
	}
}
