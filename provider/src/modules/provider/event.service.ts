import prisma from "../../../../utils/prisma";
import { notifyBetPlatform } from "../../utils/notifyBetPlatform";
import { CreateEventInput, StatusEventInput } from "./event.schema";

const selectedEvent = { // для сортировки выводимых данных
  id: true,
  coefficient: true,
  deadline: true,
  status: true,
}

export async function createEvent(input: CreateEventInput) {
  const lastEvent = await prisma.event.findFirst({
    orderBy: { createdAt: "desc" }, // сортируем по дате добавления
  });
  
  const newId = lastEvent
    ? `event${parseInt(lastEvent.id.replace("event", ""), 10) + 1}` // создаем id для новой звписи
    : "event1";

  const deadlineDate = new Date(input.deadline * 1000); // преобразуем таймстеп в дату для записи в БД
  const event = await prisma.event.create({
    data: {
      id: newId,
      coefficient: input.coefficient,
      deadline: deadlineDate,
    },
    select: selectedEvent
  });

  console.log(event, 'event');
  
  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000), // возвращаем таймстеп всемто даты
  };
}

export async function getEvents() {
  const events = await prisma.event.findMany({
    select: selectedEvent,
    orderBy: { createdAt: "asc" }
  });
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
    select: selectedEvent
  });

  await notifyBetPlatform(id, input.status) // вызываем функцию для отправки в bet_platform

  return {
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  };
}

it('should update event status and notify the bet platform', async () => {
  const eventId = 'event1';
  const input = { status: 'completed' };
  
  const mockEvent = {
      id: eventId,
      coefficient: 1.5,
      deadline: new Date('2024-09-30T10:52:00.000Z'), // Пример даты
      status: 'completed',
      createdAt: new Date('2024-09-30T10:52:00.000Z'),
  };

  // Настраиваем mock для update
  (prisma.event.update as jest.Mock).mockResolvedValue(mockEvent);

  // Вызываем функцию
  const result = await statusEvent(eventId, input);

  // Проверяем, что статус события обновлен
  expect(result).toEqual({
      ...mockEvent,
      deadline: Math.floor(mockEvent.deadline.getTime() / 1000), // Проверяем таймстемп
  });

  // Проверяем, что prisma.event.update был вызван с правильными параметрами
  expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: eventId },
      data: { status: input.status },
      select: expect.any(Object), // Можно уточнить, если необходимо
  });

  // Проверяем, что notifyBetPlatform был вызван с правильными параметрами
  expect(notifyBetPlatform).toHaveBeenCalledWith(eventId, input.status);
});