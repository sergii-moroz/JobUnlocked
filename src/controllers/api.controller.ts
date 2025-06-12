import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload } from "../types/user.types.js";

export const handleGetUserRole = async (
	req:		FastifyRequest,
	reply:	FastifyReply
) => {
	const user = req.user as JWTPayload
	console.log("USER", user)
	reply.send({success: true, role: user.role })
}
