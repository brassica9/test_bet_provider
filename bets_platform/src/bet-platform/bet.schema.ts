export const createBetSchema = {
  body: {
    type: "object",
    required: ["eventId", "amount"],
    properties: {
      eventId: { type: "string" },
      amount: { type: "number" },
    },
  },
};

export type BetType = {
  id: string;
  eventId: string;
  amount: number;
  potentialWin: number;
  status: string;
};

export type CreateBetInput = Pick<BetType, "eventId" | "amount">;
