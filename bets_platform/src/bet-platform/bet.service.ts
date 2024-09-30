import prisma from "../../../utils/prisma";
import { CreateBetInput } from "./bet.schema";

const selectedBet = { // для сортировки выводимых данных
  betId: true,
  eventId: true,
  amount: true,
  potentialWin: true,
  status: true,
};

export async function getBet() {
  const bets = await prisma.bet.findMany({
    select: selectedBet,
    orderBy: { createdAt: "asc" } // выводим данные с первых созданных
  });
  return bets;
}

export async function createBet(input: CreateBetInput) {
  const currentDate = new Date();
  const event = await prisma.event.findUnique({
    where: {
      id: input.eventId,
      deadline: {
        gt: currentDate,
      },
    },
  });

  if (!event) {
    throw new Error(`Event with this ID ${input.eventId} was not found
.`);
  }
  const sumPotentialWin = event.coefficient * input.amount;

  const lastBet = await prisma.bet.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const newId = lastBet
    ? `bet${parseInt(lastBet.betId.replace("bet", ""), 10) + 1}`
    : "bet1";

  if (!newId) {
    throw new Error(
      "Failed to generate a unique betId after several attempts."
    );
  }

  const bet = await prisma.bet.create({
    data: {
      betId: newId,
      eventId: input.eventId,
      amount: parseFloat(input.amount.toFixed(2)),
      potentialWin: parseFloat(sumPotentialWin.toFixed(2)),
    },
    select: selectedBet
  });

  return {
    ...bet,
    amount: parseFloat(bet.amount.toFixed(2)), //  это как число
    potentialWin: parseFloat(bet.potentialWin.toFixed(2)), // как число
  };
}

export async function getEvents() {
  const currentDate = new Date();

  const events = await prisma.event.findMany({
    where: {
      deadline: {
        gt: currentDate, // "gt" означает "больше", т.е. дедлайн в будущем
      },
    },
    select: {
      id: true,
      coefficient: true,
      deadline: true,
    },
    orderBy: { createdAt: "asc" }
  });
  return events.map((event) => ({
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  }));
}
