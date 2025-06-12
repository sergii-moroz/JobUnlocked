const compoHTML = `<div>
	<button
		id="btn-menu-toggle"
		class="tw-btn bg-lime-500 hover:bg-lime-500 focus:ring-lime-800 rounded-full p-2 size-10"
	>
		☰
	</button>

	<!-- Mobile Menu Modal -->
	<div
		id="mobile-menu"
		class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center z-50 flex flex-col pt-20 sm:hidden
		"
	>
		<div class="tw-card text-center p-6 w-80 space-y-4 relative">
			<button id="btn-close" class="absolute top-4 right-4 text-xl text-rose-400 dark:text-gray-300">
				✕
			</button>
			<h2 class="text-xl font-bold mb-4 dark:text-white">Welcome</h2>
			<a href="/login" data-link class="tw-btn block w-full">Login</a>
			<a href="/register" data-link class="tw-btn-outline block w-full">Register</a>
		</div>
	</div></div>
`

export class ModalLoginMenu extends HTMLElement {
	private btnToggle: HTMLElement | null = null
	private mobileMenu: HTMLElement | null = null
	private btnClose: HTMLElement | null = null

	constructor() {
		super()

		this.innerHTML = compoHTML
	}

	connectedCallback() {
		this.btnToggle = this.querySelector('#btn-menu-toggle')
		this.mobileMenu = this.querySelector('#mobile-menu')
		this.btnClose = this.querySelector('#btn-close')

		this.btnToggle?.addEventListener('click', this.btnToggleHandler)
		this.btnClose?.addEventListener('click', this.btnCloseHandler)
	}

	private btnToggleHandler = () => {
		if (this.mobileMenu) this.mobileMenu.classList.remove('hidden')
	}

	private btnCloseHandler = () => {
		if (this.mobileMenu) this.mobileMenu.classList.add('hidden')
	}

	disconnectedCallback() {
		this.btnToggle?.removeEventListener('click', this.btnToggleHandler)
		this.btnClose?.removeEventListener('click', this.btnCloseHandler)
	}

}
