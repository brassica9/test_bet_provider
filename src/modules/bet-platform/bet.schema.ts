export type BetType = {
    id: number,
    eventId: number,
    amount: number,
    potentialWin: number,
    status: string
}

export type CreateBetInput = Pick<BetType, 'eventId' | 'amount'>