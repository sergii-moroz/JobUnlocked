import { db } from "../connections.js";
import bcrypt from 'bcrypt'

const defaultDescription = `We are looking for a passionate developer to join our team.
You will work on exciting projects and collaborate with talented people.

Responsibilities:
- Develop and maintain applications
- Participate in code reviews

Benefits:
- Flexible working hours
- Remote work possible

Apply now!`;

export async function up() {
	return new Promise<void>((resolve, reject) => {
		const items = [
			{
				uuid: "uuid-jobpost-1",
				title: 'Job Title',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'c, c++, python, fastify, vanilla JS, sqlite',
				location: 'Heilbronn',
				type: 1,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-2",
				title: 'Software Engineer',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'Java, Spring Boot, SQL, REST APIs',
				location: 'Remote',
				type: 2,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-3",
				title: 'Frontend Developer',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'HTML, CSS, JavaScript, React',
				location: 'Berlin',
				type: 3,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-4",
				title: 'Backend Developer',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'Node.js, Express, MongoDB',
				location: 'Remote',
				type: 4,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-5",
				title: 'Full Stack Developer',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'JavaScript, Node.js, React, SQL',
				location: 'Heilbronn',
				type: 5,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-6",
				title: 'DevOps Engineer',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'Docker, Kubernetes, AWS, CI/CD',
				location: 'Remote',
				type: 6,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-7",
				title: 'Data Scientist',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'Python, R, Machine Learning, Data Analysis',
				location: 'Berlin',
				type: 7,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-8",
				title: 'Mobile Developer',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'iOS, Android, React Native, Flutter',
				location: 'Remote',
				type: 8,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-9",
				title: 'UI/UX Designer',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'Figma, Adobe XD, User Research, Prototyping',
				location: 'Heilbronn',
				type: 9,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-10",
				title: 'System Administrator',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'Linux, Networking, Security, Troubleshooting',
				location: 'Remote',
				type: 10,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-11",
				title: 'Cloud Engineer',
				partner_id: "uuid-partner-1",
				description: defaultDescription,
				requirements: 'AWS, Azure, GCP, Cloud Architecture',
				location: 'Berlin',
				type: 11,
				job_status: 1,
			},
			{
				uuid: "uuid-jobpost-12",
				title: 'QA Engineer',
				partner_id: "uuid-partner-2",
				description: defaultDescription,
				requirements: 'Testing, Automation, Selenium, JUnit',
				location: 'Remote',
				type: 12,
				job_status: 1,
			}
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
