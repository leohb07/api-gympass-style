import { FastifyInstance } from "fastify";
import { verifyJwtMiddleware } from "@/http/middlewares/verify-jwt.middleware";
import { GymsController } from "./gyms.controller";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwtMiddleware);

  const gymsController = new GymsController();

  app.get("/gyms/search", gymsController.searchMany);
  app.get("/gyms/nearby", gymsController.searchNearby);

  app.post("/gyms", gymsController.create);
}
