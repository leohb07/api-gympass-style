import { FastifyInstance } from "fastify";
import { verifyJwtMiddleware } from "@/http/middlewares/verify-jwt.middleware";
import { UsersController } from "./users.controller";

export async function usersRoutes(app: FastifyInstance) {
  const usersController = new UsersController();

  app.post("/users", usersController.register);
  app.post("/sessions", usersController.authenticate);

  app.patch("/token/refresh", usersController.refresh);

  app.get(
    "/me",
    { onRequest: [verifyJwtMiddleware] },
    usersController.getProfile,
  );
}