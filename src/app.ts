import fastify, { FastifyReply, FastifyRequest, FastifyServerOptions } from "fastify"
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import { fileURLToPath } from "url";
import path from "path";
import fs from 'fs';

import { authRoutes } from "./routes/auth.route.js";
import { initializeDB } from "./db/init.js";
import { normalizeError } from "./errors/error.js";
import { apiRoutes } from "./routes/api.route.js";

export const build = async (opts: FastifyServerOptions) => {
	const app = fastify(opts)

	app.register(fastifyCookie, {
		secret: 'cookiesecret-key-cookiesecret-key',
	});

	app.ready(async (err) => {
		initializeDB()
	})

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	app.setNotFoundHandler((request, reply) => {
		const requestURL = request.url;
		if (request.raw.method === 'GET' && (!requestURL.startsWith('/api/') && !requestURL.startsWith('/ws/'))) {
			return reply.type('text/html').send(fs.readFileSync(path.join(__dirname, 'public/index.html')));
		}
		reply.status(404).send({ error: 'Not found' });
	});

	app.register(fastifyStatic, {
		root: path.join(__dirname, 'public'),
		prefix: '/'
	})

	// app.register(routes);
	app.register(authRoutes, { prefix: 'auth' })
	app.register(apiRoutes, { prefix: 'api' })

	// GLOBAL ERROR HANDLING
	app.setErrorHandler( async (error, request, reply) => {
		const normalizedError = normalizeError(error);

		app.log.error(error);

		await reply
			.code(normalizedError.statusCode)
			.send(normalizedError);
	})

	return app
}
