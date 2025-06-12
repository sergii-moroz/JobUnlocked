export interface JobOffer {
	id: string;
	createdBy: string;
	title: string;
	description: string;
	requirements: string;
	type: number;
	jobStatus: number;
	location: string;
	salary: number;
	company: string;
	createdAt: Date;
	updatedAt: Date;
}
