import { FastifyRequest } from "fastify";
import { z } from "zod";

export function createGymValidationBody(request: FastifyRequest) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  return createGymBodySchema.parse(request.body);
}
