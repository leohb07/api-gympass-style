import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins.repository";
import { UserMetricsUseCase } from "../user-metrics.usecase";

export function makeUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new UserMetricsUseCase(checkInsRepository);

  return useCase;
}
