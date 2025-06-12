import { db } from "../connections.js";
import bcrypt from 'bcrypt'

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			{
				uuid: "uuid-jobpost-1",
				title: 'Job Title',
				partner_id: "uuid-partner-1",
				description: 'description',
				requirements: 'c, c++, python, fastify, vanilla JS, sqlite',
				location: 'Heilbronn',
				type: 1,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-2",
				title: 'Full-stack developer',
				partner_id: "uuid-partner-2",
				description: 'description',
				requirements: 'NextJS, FastAPI, docker',
				location: 'Heilbronn',
				type: 1,
				job_status: 1,
			},
		];

		db.serialize(() => {
			for (const item of items) {
				const uuid = item.uuid || crypto.randomUUID()
				db.run(
					`INSERT INTO jobPosts (id, partner_id, title, description, requirements, location, type, job_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
					[uuid, item.partner_id, item.title, item.description, item.requirements, item.location, item.type, item.job_status],
					(err) => {
						if (err) reject(err);
					}
				);
			}
			resolve();
		});
	});
}
