
import { API } from "../api.js"
import { Router } from "../router.js"

const formHTML = `
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

		<button
			type="submit"
			class="tw-btn w-full"
		>
			Sign in
		</button>
	</form>
`

export class LoginForm extends HTMLElement {
	private form: HTMLElement | null = null
	private email: HTMLInputElement | null = null
	private password: HTMLInputElement | null = null
	private emailError: HTMLElement | null = null
	private passwordError: HTMLElement | null = null

	constructor() {
		super()
		this.innerHTML = formHTML
	}

	connectedCallback() {
		this.form = this.querySelector('form')
		this.email = this.querySelector('#email')
		this.password = this.querySelector('#password')

		this.emailError = this.querySelector('#email-error')
		this.passwordError = this.querySelector('#password-error')

		this.form?.addEventListener('submit', this)
	}

	disconnectedCallback() {
		this.form?.removeEventListener('submit', this)
	}

	async handleEvent(event: Event) {
		event.preventDefault()

		if (!this.email || !this.password) return
		if (!this.emailError || !this.passwordError) return

		const email = this.email.value.trim()
		const password = this.password.value.trim()

		let hasError = false

		// VALIDATION

		if (email.length <= 0) {
			this.showError(this.emailError, 'Email is required')
			hasError = true
		}

		if (password.length <= 0) {
			this.showError(this.passwordError, 'Password is required')
			hasError = true
		}

		if (hasError) return

		const res = await API.login(this.email.value, this.password.value)

		if (res.requires2FA) {
			sessionStorage.setItem('temp2faToken', res.token)
			return Router.navigateTo('/login/2fa/verify')
		}

		if (res.success) {
			return Router.navigateTo('/home')
		} else {
			this.showError(this.passwordError, res.message ?? 'Login failed')
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
}
