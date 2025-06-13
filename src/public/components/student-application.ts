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
        <div id='parent' class="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
			<h2 class="text-3xl font-extrabold text-gray-800 text-center mb-3">Apply for the position</h2>
			<p class="text-sm text-gray-600 text-center mb-6">
				Please upload your documents below. <br>Submitting this form is your official application.
			</p>

			<form id="application-form" class="space-y-6" enctype="multipart/form-data">

				<!-- CV Upload -->
				<div>
					<label for="cv" class="block text-sm font-medium text-gray-700 mb-1">CV</label>
					<input type="file" id="cv" name="cv" accept=".pdf" required
						class="block w-full text-sm text-gray-600 rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
				</div>

				<!-- Cover Letter Upload -->
				<div>
					<label for="cl" class="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
					<input type="file" id="cl" name="cl" accept=".pdf" required
						class="block w-full text-sm text-gray-600 rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
				</div>

				<!-- Extra Files Upload -->
				<div>
					<label for="extra" class="block text-sm font-medium text-gray-700 mb-1">Additional Documents</label>
					<input type="file" id="extra" name="extra" accept=".pdf" multiple
						class="block w-full text-sm text-gray-600 rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition" />
				</div>

				<!-- Buttons -->
				<div class="pt-6 flex justify-between items-center">
					<a href="/home" data-link class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</a>
					<button type="submit"
						class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
						Submit Application
					</button>
				</div>
			</form>

			<!-- Notes -->
			<div class="mt-6 space-y-2 text-sm text-gray-500 text-center italic">
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