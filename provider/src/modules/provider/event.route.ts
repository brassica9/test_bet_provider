import { FastifyInstance } from "fastify";
import { changeStatusHandler, createEventHandler, getEventsHandler } from "./event.controller";
import { createEventSchema, statusEventSchema } from "./event.schema";

async function eventRoutes(server: FastifyInstance) {
  server.get("/", getEventsHandler);

  server.post("/", { schema: createEventSchema }, createEventHandler);

  server.put("/:id", { schema: statusEventSchema }, changeStatusHandler);
}

export default eventRoutes;
