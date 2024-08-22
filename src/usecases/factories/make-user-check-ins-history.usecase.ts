import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins.repository";
import { UserCheckInsHistoryUseCase } from "../user-check-ins-history.usecase";

export function makeUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new UserCheckInsHistoryUseCase(checkInsRepository);

  return useCase;
}
