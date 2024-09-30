import prisma from "../../../utils/prisma";

export async function createWebhookHandler(eventId: string, status: string) {
  const bets = await prisma.bet.findMany({
    where: {
      eventId: eventId,
    },
  });

  if (bets.length === 0) { // проверяем есть ли ставки с этим эвентом
    return { message: "No bids found", eventId };
  }

  const updatePromises = bets.map((bet) => {
    const updatedStatus = status === "first_team_won" ? "won" : "lost";

    return prisma.bet.update({
      where: { betId: bet.betId },
      data: { status: updatedStatus },
    });
  });

  const updatedBets = await Promise.all(updatePromises); //обновляем все ставки

    return { message: "Status updated successfully", eventId, status };
}
