import { FastifyReply, FastifyRequest } from "fastify";
import { createEvent, getEvents, statusEvent } from "./event.service";
import { CreateEventInput, StatusEventInput } from "./event.schema";

export async function getEventsHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    const events = await getEvents();

    return rep.code(200).send(events);
  } catch (error) {
    console.error(error);
    return rep.code(500).send(error);
  }
}

export async function createEventHandler(
  req: FastifyRequest<{
    Body: CreateEventInput;
  }>,
  rep: FastifyReply
) {
  const body = req.body;

  try {
    const event = await createEvent(body);

    return rep.code(201).send(event);
  } catch (error) {
    console.error(error);
    return rep.code(500).send(error);
  }
}

export async function changeStatusHandler(
  req: FastifyRequest<{
    Body: StatusEventInput;
    Params: { id: string };
  }>,
  rep: FastifyReply
) {
  const body = req.body;
  const idEvent = parseInt(req.params.id, 10)
  try {
    const event = await statusEvent(idEvent, body);

    return rep.code(200).send(event);
  } catch (error) {
    console.error(error);
    return rep.code(500).send(error);
  }
}
