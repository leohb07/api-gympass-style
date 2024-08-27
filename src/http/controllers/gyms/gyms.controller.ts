import { makeCreateGymUseCase } from "@/usecases/factories/make-create-gym.usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { createGymValidationBody } from "./validations/create-gym.validation";
import { makeSearchGymsUseCase } from "@/usecases/factories/make-search-gym.usecase";
import { searchGymsValidationQueryParams } from "./validations/search-gyms.validation";
import { makeNearbyGymsUseCase } from "@/usecases/factories/make-nearby-gym.usecase";
import { searchNearbyGymsValidationBody } from "./validations/search-nearby-gyms.validation";

export class GymsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, phone, longitude, latitude } =
      createGymValidationBody(request);

    const createGymUseCase = makeCreateGymUseCase();

    await createGymUseCase.execute({
      title,
      description,
      phone,
      longitude,
      latitude,
    });

    return reply.status(201).send();
  }

  async searchMany(request: FastifyRequest, reply: FastifyReply) {
    const { page, query } = searchGymsValidationQueryParams(request);

    const searchGymUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymUseCase.execute({
      page,
      query,
    });

    return reply.status(200).send({
      gyms,
    });
  }

  async searchNearby(request: FastifyRequest, reply: FastifyReply) {
    const { latitude, longitude } = searchNearbyGymsValidationBody(request);

    const nearbyGymsUseCase = makeNearbyGymsUseCase();

    const { gyms } = await nearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(200).send({
      gyms,
    });
  }
}
