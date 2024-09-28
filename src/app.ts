import Fastify from "fastify";
import eventRoutes from "./modules/provider/event.route";


const server = Fastify();

server.get("/check", async function () {
  return { status: "OK" };
});

async function main() {
    server.register(eventRoutes, {prefix: "api/events"})

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });

    console.log("Server ready at http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
