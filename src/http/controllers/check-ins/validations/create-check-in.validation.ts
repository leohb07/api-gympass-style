import { FastifyRequest } from "fastify";
import { z } from "zod";

export function createCheckInValidationQueryParams(request: FastifyRequest) {
  const schema = z.object({
    gymId: z.string(),
  });

  return schema.parse(request.params);
}

export function createCheckInValidationBody(request: FastifyRequest) {
  const schema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  return schema.parse(request);
}
