import prisma from "../../../utils/prisma";
import { CreateBetInput } from "./bet.schema";

export async function getBet() {
  const bets = await prisma.bet.findMany();
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
    orderBy: { betId: "desc" },
  });

  console.log(lastBet);

  let newId;

  if (lastBet) {
    // Извлекаем числовую часть идентификатора
    const match = lastBet.betId.match(/bet(\d+)/);
    if (match) {
      const numberPart = parseInt(match[1], 10);
      newId = `bet${numberPart + 1}`; // Увеличиваем на 1
    } else {
      newId = "bet1"; // Если идентификатор не соответствует формату
    }
  } else {
    newId = "bet1"; // Если нет ставок
  }

  if (!newId) {
    throw new Error(
      "Failed to generate a unique betId after several attempts."
    );
  }
  console.log("=======", newId);

  const bet = await prisma.bet.create({
    data: {
      betId: newId,
      eventId: input.eventId,
      amount: parseFloat(input.amount.toFixed(2)),
      potentialWin: parseFloat(sumPotentialWin.toFixed(2)),
    },
  });
  console.log("========", {
    amount: bet.amount.toFixed(2),
    potentialWin: bet.potentialWin.toFixed(2),
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
  });
  return events.map((event) => ({
    ...event,
    deadline: Math.floor(event.deadline.getTime() / 1000),
  }));
}
