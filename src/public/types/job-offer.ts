import { JobType } from "./enums.js";

export interface JobOffer {
	id: string;
	createdBy: string;
	title: string;
	description: string;
	requirements: string;
	type: JobType;
	jobStatus: number;
	location: string;
	company: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface JobOfferRequest {
	title: string;
	description: string;
	requirements: string;
	type: JobType;
	location: string;
}
