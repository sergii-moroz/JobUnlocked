import 'fastify';
import { JWTPayload } from './user.types.js';


declare module 'fastify' {

	interface FastifyRequest {
		user: JWTPayload
	}

}
