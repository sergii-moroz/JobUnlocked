import { API } from "../../api.js"

export class Profile extends HTMLElement {
	private UserInfo: any; // Define the type according to your API response
	private UserRole: number | undefined; // Optional, if you need to handle user roles

	constructor() {
		super();
	}

	async connectedCallback() {
		this.loadingRender();
		const response = await API.get42UserInfo() // replace with corresponding function
		const userRoleResponse = await API.getUserRole(); // Fetch user role if needed
		if (response.success) {
			this.UserInfo = response.data;
			this.UserRole = userRoleResponse.success ? userRoleResponse.role : null; // Handle user role if needed
			if(this.UserRole && this.UserRole != 2)
				this.render();
			else
				this.errorRender(); // or Router.navigateTo('/home')
		} else {
			this.errorRender(); // or Router.navigateTo('/home')
		}
	}

	disconnectedCallback() {
		//
	}

	private loadingRender() {
		this.innerHTML = `
			<div class="tw-card max-w-xl mx-auto mt-20 p-8 rounded-2xl border border-gray-100 bg-white dark:bg-gray-800 shadow-xl dark:shadow-none flex flex-col items-center">
				<div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-6"></div>
				<p class="text-gray-700 dark:text-gray-300 text-center text-lg">Loading profile...</p>
			</div>
		`;
	}

	private render() {
		const user = this.UserInfo;
		this.innerHTML = `
			<div class="tw-card max-w-xl mx-auto mt-12 p-8 rounded-2xl border border-gray-100 bg-white dark:bg-gray-800 shadow-xl dark:shadow-none">
				<div class="flex flex-col items-center gap-4">
					<img src="${user.image?.link || user.image_url || '/assets/default-avatar.png'}" alt="Profile picture"
						class="w-28 h-28 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover mb-2">
					<h1 class="text-3xl font-extrabold text-gray-800 dark:text-white text-center">${user.displayname || user.login}</h1>
					<p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">${user.email}</p>
					<!-- User Role Badge -->
					<span class="inline-block px-4 py-1 rounded-full font-semibold text-sm
						${user['staff?']
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
							: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}
						shadow mb-2">
						${user['staff?'] ? 'Staff Member' : 'Student'}
					</span>
					<div class="flex flex-wrap justify-center gap-4 mt-2">
						<div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300">
							<span class="font-semibold">Login:</span> ${user.login}
						</div>
						<div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300">
							<span class="font-semibold">Campus:</span> ${user.campus?.[0]?.name || 'N/A'}
						</div>
						<div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300">
							<span class="font-semibold">Level:</span> ${user.cursus_users?.[0]?.level ? user.cursus_users[0].level.toFixed(2) : 'N/A'}
						</div>
					</div>
					<div class="mt-6 w-full">
						<h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">About</h2>
						<p class="text-gray-700 dark:text-gray-300 text-center">${user.phone || ''}</p>
					</div>
				</div>
			</div>
		`;
	}

	private errorRender() {
		this.innerHTML = `
		<div class="tw-card max-w-xl mx-auto mt-20 p-8 rounded-2xl border border-red-200 bg-white dark:bg-gray-900 shadow-xl dark:shadow-none flex flex-col items-center">
			<div class="text-6xl mb-4 text-red-400 dark:text-red-300">🚫</div>
			<h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2 text-center">Insufficient Permission</h1>
			<p class="text-gray-600 dark:text-gray-300 text-center mb-2">
				You do not have access to view this profile.<br>
				Please contact support if you believe this is a mistake.
			</p>
			<a href="/home" data-link class="tw-btn-outline mt-4">Go Home</a>
		</div>
		`;
	}
}
