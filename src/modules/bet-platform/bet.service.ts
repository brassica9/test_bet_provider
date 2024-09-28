import prisma from "../utils/prisma";
import { CreateBetInput } from "./bet.schema";

export async function createBet (input: CreateBetInput) {
    const bet = await prisma.bet.create({data: input})
}