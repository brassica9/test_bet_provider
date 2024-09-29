import prisma from "../../../../utils/prisma";
import { notifyBetPlatform } from "../../utils/notifyBetPlatform";
import { CreateEventInput, StatusEventInput } from "./event.schema";

export async function createEvent(input: CreateEventInput) {
  const lastEvent = await prisma.event.findFirst({
    orderBy: { id: "desc" },
  });
  console.log(lastEvent, 'lastEvent');
  
  const newId = lastEvent
    ? `event${parseInt(lastEvent.id.replace("event", ""), 10) + 1}`
    : "event1";
console.log(newId, 'newId');

  const deadlineDate = new Date(input.deadline * 1000);
  const event = await prisma.event.create({
    data: {
      id: newId,
      coefficient: input.coefficient,
      deadline: deadlineDate,
    },
  });

  console.log(event, 'event');
  
  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  };
}

export async function getEvents() {
  const events = await prisma.event.findMany();
  return events.map((event) => ({
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  }));
}

export async function statusEvent(id: string, input: StatusEventInput) {
  const event = await prisma.event.update({
    where: {
      id: id,
    },
    data: { status: input.status },
  });

  await notifyBetPlatform(id, input.status)

  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  };
}
