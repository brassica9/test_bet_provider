import Fastify from "fastify";
import betsRoutes from "./bet-platform/bet.route";
import { webhookRoutes } from "./webhooks/webhooks.controller";

const server = Fastify();

server.get("/check", async function () {
  return { status: "OK" };
});

async function main() {
  server.register(betsRoutes, { prefix: "api/" });
  server.register(webhookRoutes);

  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });

    console.log("Server ready at http://localhost:3001");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
