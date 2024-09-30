import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWebhookHandler } from "./webhooks.service";

type WebhookRequest = {
  eventId: string;
  status: string;
};

export async function webhookRoutes(server: FastifyInstance) {
  server.post(
    "/api/webhook",
    async (
      req: FastifyRequest<{
        Body: WebhookRequest;
      }>,
      rep: FastifyReply
    ) => {
      const { eventId, status } = req.body;

      try {
        await createWebhookHandler(eventId, status);
      } catch (error) {
        console.error(error);
        rep.code(500).send(error);
      }
    }
  );
}
