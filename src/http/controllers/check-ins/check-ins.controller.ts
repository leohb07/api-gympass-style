import { FastifyReply, FastifyRequest } from "fastify";
import {
  createCheckInValidationBody,
  createCheckInValidationQueryParams,
} from "./validations/create-check-in.validation";
import { makeCheckInUseCase } from "@/usecases/factories/make-check-in.usecase";
import { findHistoryValidationQueryParams } from "./validations/find-history.validation";
import { makeUserCheckInsHistoryUseCase } from "@/usecases/factories/make-user-check-ins-history.usecase";
import { makeUserMetricsUseCase } from "@/usecases/factories/make-user-metrics.usecase";
import { validateCheckInValidationQueryParams } from "./validations/validate-check-in.validation";
import { makeValidateCheckInUseCase } from "@/usecases/factories/make-validate-check-in.usecase";

export class CheckInsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { gymId } = createCheckInValidationQueryParams(request);

    const { latitude, longitude } = createCheckInValidationBody(request);

    const checkInUsecase = makeCheckInUseCase();

    await checkInUsecase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(201).send();
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const { checkInId } = validateCheckInValidationQueryParams(request);

    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
      checkInId,
    });

    return reply.status(204).send();
  }

  async findHistory(request: FastifyRequest, reply: FastifyReply) {
    const { page } = findHistoryValidationQueryParams(request);

    const userCheckInsHistoryUseCase = makeUserCheckInsHistoryUseCase();

    const { checkIns } = await userCheckInsHistoryUseCase.execute({
      page,
      userId: request.user.sub,
    });

    return reply.status(200).send({
      checkIns,
    });
  }

  async findMetrics(request: FastifyRequest, reply: FastifyReply) {
    const userMetricsUseCase = makeUserMetricsUseCase();

    const { checkInsCount } = await userMetricsUseCase.execute({
      userId: request.user.sub,
    });

    return reply.status(200).send({
      checkInsCount,
    });
  }
}
