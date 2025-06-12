
import { API } from "../api.js"
import { Router } from "../router.js"

const innerHTML = `
<form class="space-y-4 md:space-y-6">
		<div>
			<label
				for="email"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				Your Email
			</label>
			<input
				type="text"
				name="email"
				id="email"
				class="tw-input"
				placeholder="user@example.com"
				autofocus
			>
			<p
				class="text-red-500 text-xs mt-1 hidden"
				id="email-error"
			></p>
		</div>

		<div>
			<label
				for="password"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				Password
			</label>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="••••••••"
				class="tw-input"
			>
			<p
				class="text-red-500 text-xs mt-1 hidden"
				id="password-error"
			></p>
		</div>

		<div>
			<label
				for="repeated"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				Repeat password
			</label>
			<input
				type="password"
				name="repeated"
				id="repeated"
				placeholder="••••••••"
				class="tw-input"
			>
			<p
				class="text-red-500 text-xs mt-1 hidden"
				id="repeated-error"
			></p>
		</div>

		<button
			type="submit"
			class="tw-btn w-full"
			>
			Sign up
		</button>
	</form>
`

export class RegisterForm extends HTMLElement {
	private form: HTMLElement | null = null
	private email: HTMLInputElement | null = null
	private password: HTMLInputElement | null = null
	private repeated: HTMLInputElement | null = null
	private emailError: HTMLInputElement | null = null
	private passwordError: HTMLInputElement | null = null
	private repeatedError: HTMLInputElement | null = null

	constructor() {
		super()
		this.render()
	}

	connectedCallback() {
		this.form = this.querySelector('form')
		this.email = this.querySelector('#email')
		this.password = this.querySelector('#password')
		this.repeated = this.querySelector('#repeated')

		this.emailError = this.querySelector('#email-error')
		this.passwordError = this.querySelector('#password-error')
		this.repeatedError = this.querySelector('#repeated-error')

		this.form?.addEventListener('submit', this)
	}

	disconnectedCallback() {
		this.form?.removeEventListener('submit', this)
	}

	async handleEvent(event: Event) {
		event.preventDefault()

		if (!this.email || !this.password || !this.repeated) return
		if (!this.emailError || !this.passwordError || !this.repeatedError) return

		const email = this.email.value.trim()
		const password = this.password.value.trim()
		const repeated = this.repeated.value.trim()

		let hasError = false

		if (!this.isValidEmail(email)) {
			this.showError(this.emailError, 'Provide valid email')
			hasError = true
		}

		if (password.length < 6) {
			this.showError(this.passwordError, 'Password must be at least 6 characters')
			hasError = true
		}

		if (password.length > 64) {
			this.showError(this.passwordError, 'Your password is too long')
			hasError = true
		}

		if (/\s+/g.test(password)) {
			this.showError(this.passwordError, 'Password could not contain white spaces')
			hasError = true
		}

		if (repeated !== password) {
			this.showError(this.repeatedError, 'Passwords do not match')
			hasError = true
		}

		if (hasError) return

		const res = await API.register(this.email.value, this.password.value, this.repeated.value)

		if (res.success) {
			return Router.navigateTo('/home')
		} else {
			this.showError(this.repeatedError, res.message ?? 'Registration failed')
		}
	}

	private showError(element: HTMLElement, message: string) {
		let errorTimeout

		clearTimeout(errorTimeout)

		element.innerHTML = `
		<div class="relative">
			<p class="py-1">${message}</p>
			<div class="absolute bottom-0 left-0 h-1 bg-red-300 animate-error-bar w-full rounded-sm"></div>
		</div>
		`
		element.classList.remove('hidden')
		errorTimeout = setTimeout(() => {
			element.innerHTML = ''
			element.classList.add('hidden')
		}, 4000)
	}

	private render() {
		this.innerHTML = innerHTML
	}

	private isValidEmail(email: string): boolean {
		return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
	}

}
