import { FastifyInstance } from "fastify";
import { createBetHandler, getBatsHandler, getEventsHandler } from "./bet.controller";
import { createBetSchema } from "./bet.schema";

async function betsRoutes(server: FastifyInstance) {
  server.get("/bets", getBatsHandler);

  server.post("/bets", { schema: createBetSchema }, createBetHandler);

  server.get("/events", getEventsHandler)
}

export default betsRoutes;
