import { FastifyRequest } from "fastify";
import { z } from "zod";

export function validateCheckInValidationQueryParams(request: FastifyRequest) {
  const schema = z.object({
    checkInId: z.string().uuid(),
  });

  return schema.parse(request.params);
}
