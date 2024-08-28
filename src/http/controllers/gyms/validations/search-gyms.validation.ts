import { FastifyRequest } from "fastify";
import { z } from "zod";

export function searchGymsValidationQueryParams(request: FastifyRequest) {
  const schema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  return schema.parse(request.query);
}
