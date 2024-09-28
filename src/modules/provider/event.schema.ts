export const createEventSchema = {
  body: {
    type: "object",
    required: ["coefficient", "deadline"],
    properties: {
      coefficient: { type: "number" },
      deadline: { type: "number" },
    },
  },
};

export const statusEventSchema = {
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["first_team_won", "second_team_won"],
      },
    },
  },
};

export type EventResponse = {
  id: number;
  coefficient: number;
  deadline: number;
  status: string;
};

// export type StatusEventInput = 'first_team_won' | 'second_team_won';
export type StatusEventInput= Pick<EventResponse, 'status'>

export type CreateEventInput = Pick<EventResponse, 'coefficient' | 'deadline'>
