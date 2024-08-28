import { FastifyRequest } from "fastify";
import { z } from "zod";

export function searchNearbyGymsValidationQueryParams(request: FastifyRequest) {
  const schema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  return schema.parse(request.query);
}
