import prisma from "../../../utils/prisma";

export async function createWebhookHandler(eventId: string, status: string) {
  console.log(eventId, status, "сервис createWebhookHandler");

  const bets = await prisma.bet.findMany({
    where: {
      eventId: eventId,
    },
  });

  // Проверяем, есть ли ставки
  if (bets.length === 0) {
    console.log(`Ставки не найдены для события ${eventId}`);
    return { message: "Ставки не найдены", eventId };
  }

  // Обновляем статус для каждой ставки
  const updatePromises = bets.map((bet) => {
    const updatedStatus = status === "first_team_won" ? "won" : "lost";

    return prisma.bet.update({
      where: { betId: bet.betId }, // Указываем уникальный идентификатор ставки
      data: { status: updatedStatus }, // Обновляем статус
    });
  });

  // Ждем, пока все обновления будут выполнены
  const updatedBets = await Promise.all(updatePromises);

  console.log(updatedBets, "Обновленные ставки");

  return { message: "Статус успешно обновлен", eventId, status };

  //   bets.map((bet) => {
  //     if (status === "first_team_won") {
  //       bet.status = "won";
  //     } else {
  //       bet.status = "lost";
  //     }
  //   });

  //   console.log(bets);

  //   return { message: "Status updated successfully", eventId, status };
}
