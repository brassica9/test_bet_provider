import { FastifyInstance } from "fastify";
import { createBetHandler } from "./bet.controller";

async function betsRoutes(server: FastifyInstance) {
    server.post("/", createBetHandler)
}

export default betsRoutes