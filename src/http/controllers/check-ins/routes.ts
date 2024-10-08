import { FastifyInstance } from "fastify";
import { verifyJwtMiddleware } from "@/http/middlewares/verify-jwt.middleware";
import { CheckInsController } from "./check-ins.controller";
import { verifyRoleUser } from "@/http/middlewares/verify-user-role.middleware";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwtMiddleware);

  const checkInsController = new CheckInsController();

  app.get("/check-ins/history", checkInsController.findHistory);
  app.get("/check-ins/metrics", checkInsController.findMetrics);

  app.post("/gyms/:gymId/check-ins", checkInsController.create);

  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyRoleUser("ADMIN")] },
    checkInsController.validate,
  );
}
