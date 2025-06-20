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
	salary: number;
	company: string;
	approval_date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface JobOfferRequest {
	title: string;
	description: string;
	requirements: string;
	type: JobType;
	location: string;
}