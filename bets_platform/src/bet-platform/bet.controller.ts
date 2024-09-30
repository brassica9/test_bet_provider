import { FastifyReply, FastifyRequest } from "fastify";
import { CreateBetInput } from "./bet.schema";
import { createBet, getBet, getEvents } from "./bet.service";

export async function getBatsHandler(req: FastifyRequest, rep: FastifyReply) {
    try {
        const bets = await getBet();

        return rep.code(200).send(bets)
    } catch (error) {
        console.error(error);
        return rep.code(500).send(error);
    }
}

export async function createBetHandler(
  req: FastifyRequest<{
    Body: CreateBetInput;
  }>,
  rep: FastifyReply
) {
  const body = req.body;

  if (!body.eventId || typeof body.amount !== 'number' || body.amount <= 0) {
    return rep.code(400).send({ message: "Event not specified or incorrect amount." });
  }
  try {
    const bet = await createBet(body);

    return rep.code(201).send(bet);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("was not found")) {
        return rep.code(404).send({ message: error.message });
      }
      return rep
        .code(500)
        .send({ message: "An error occurred while creating a bid." });
    }
    return rep.code(500).send({ message: "Unknown error." });
  }
}

export async function getEventsHandler(req: FastifyRequest, rep: FastifyReply) {
    try {
        const events = await getEvents();

        return rep.code(200).send(events)
    } catch (error) {
        console.error(error);
        return rep.code(500).send(error);
    }
}
