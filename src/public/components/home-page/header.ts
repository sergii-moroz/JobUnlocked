import { API } from "../../api.js";
import { Router } from "../../router.js";
import {
	iconHomeProfile,
	iconSettings,
	iconPower,
} from "../icons/icons.js"

export class HomeHeader extends HTMLElement {

	constructor() {
		super()
		this.render()
	}

	connectedCallback() {
		this.addEventListener('click', this.handleClick);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleClick);
	}

	async handleClick(event: Event) {
		const target = event.target as HTMLElement;

		if (target.closest('#profile-btn')) {
			Router.navigateTo('/profile');
		}
		else if (target.closest('#settings-btn')) {
			Router.navigateTo('/setting');
		}
		else if (target.closest('#logout-btn')) {
			await API.logout();
			Router.navigateTo('/login');
		}
	}

	render() {
		this.innerHTML = `
			<header class="h-16 flex justify-between items-center p-4 sm:p-8">
				<h1 class="text-xl sm:text-3xl font-bold">🔓JobUnlocked</h1>
				<div class="flex items-center gap-1 sm:gap-2 md:gap-3">
					<button id="profile-btn" class="p-2 [&>svg]:size-5 sm:[&>svg]:size-6 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full hover:shadow-lg transition-all hover:scale-[1.04]">
						${iconHomeProfile}
					</button>
					<button id="settings-btn" class="p-2 [&>svg]:size-5 sm:[&>svg]:size-6 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full hover:shadow-lg transition-all hover:scale-[1.04]">
						${iconSettings}
					</button>
					<button id="logout-btn" class="p-2 md:px-4 bg-red-500 hover:bg-red-600 rounded-full hover:shadow-lg transition-all hover:scale-[1.04]">
						<span class="md:hidden text-white [&>svg]:size-5 sm:[&>svg]:size-6">${iconPower}</span>
						<span class="hidden text-white md:inline-block">Logout</span>
					</button>
				</div>
			</header>
		`;
	}
}
