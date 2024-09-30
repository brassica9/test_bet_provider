
import { createEvent, getEvents, statusEvent } from "../provider/src/modules/provider/event.service";
import prisma from "../utils/prisma";
import {notifyBetPlatform} from '../provider/src/utils/notifyBetPlatform'

jest.mock("../utils/prisma", () => ({ 
  event: {
    findFirst: jest.fn(), // Мокаем методы
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn()
  },
}));
jest.mock('../provider/src/utils/notifyBetPlatform', () => ({
    notifyBetPlatform: jest.fn(), // Мокаем функцию notifyBetPlatform
}));

it('should create a new event with deadline as timestamp', async () => {
    const timestamp = Math.floor(Date.now() / 1000); // Таймстемп в секундах
    const input = {
        coefficient: 1.5,
        deadline: timestamp,
    };

    const createdAt = new Date();
    const mockEvent = {
        id: 'event1',
        coefficient: 1.5,
        deadline: new Date(timestamp * 1000),
        status: 'pending', 
        createdAt, 
    };

    // Мокаем вызов Prisma
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.event.create as jest.Mock).mockResolvedValue(mockEvent);

    const result = await createEvent(input);

    // результат
    expect(result).toEqual({
        id: 'event1',
        coefficient: 1.5,
        deadline: timestamp,
        status: 'pending',
        createdAt: expect.any(Date),
    });

    // Проверяем, что prisma.event.create был вызван с правильными параметрами
    expect(prisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
            data: expect.objectContaining({
                coefficient: input.coefficient,
                deadline: expect.any(Date),
            }),
            select: expect.objectContaining({
                coefficient: true,
                deadline: true,
                id: true,
                status: true,
            }),
        })
    );
});

it('should return events with deadline as timestamp', async () => {
    const mockEvents = [
        {
            id: 'event1',
            coefficient: 1.5,
            deadline: new Date('2024-09-30T10:52:00.000Z'), 
            status: 'pending',
            createdAt: new Date('2024-09-30T10:52:00.000Z'),
        },
        {
            id: 'event2',
            coefficient: 2.0,
            deadline: new Date('2024-09-30T11:00:00.000Z'), 
            status: 'pending',
            createdAt: new Date('2024-09-30T11:00:00.000Z'),
        },
    ];

    // mock для findMany
    (prisma.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

    const result = await getEvents();

    // Проверяем результат
    expect(result).toEqual([
        {
            id: 'event1',
            coefficient: 1.5,
            deadline: Math.floor(new Date('2024-09-30T10:52:00.000Z').getTime() / 1000),
            status: 'pending',
            createdAt: expect.any(Date),
        },
        {
            id: 'event2',
            coefficient: 2.0,
            deadline: Math.floor(new Date('2024-09-30T11:00:00.000Z').getTime() / 1000),
            status: 'pending',
            createdAt: expect.any(Date),
        },
    ]);
});

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

    (prisma.event.update as jest.Mock).mockResolvedValue(mockEvent);

    const result = await statusEvent(eventId, input);

    // Проверяем статус обновлен
    expect(result).toEqual({
        ...mockEvent,
        deadline: Math.floor(mockEvent.deadline.getTime() / 1000), // Проверяем таймстемп
    });

    // Проверяем, что prisma.event.update был вызван с правильными параметрами
    expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: eventId },
        data: { status: input.status },
        select: expect.any(Object),
    });

    //  notifyBetPlatform был вызван с правильными параметрами
    expect(notifyBetPlatform).toHaveBeenCalledWith(eventId, input.status);
});