import prisma from "../utils/prisma";
import { CreateEventInput, StatusEventInput } from "./event.schema";

export async function createEvent(input: CreateEventInput) {
  const deadlineDate = new Date(input.deadline * 1000);
  const event = await prisma.event.create({
    data: {
      coefficient: input.coefficient,
      deadline: deadlineDate,
    },
  });
  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  };
}

export async function getEvents() {
  const events = await prisma.event.findMany({});
  return events.map((event) => ({
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  }));
}

export async function statusEvent(id: number, input: StatusEventInput) {
  const event = await prisma.event.update({
    where: {
      id: id,
    },
    data: { status: input.status },
  });
  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  };
}
