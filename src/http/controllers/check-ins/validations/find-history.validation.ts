import { FastifyRequest } from "fastify";
import { z } from "zod";

export function findHistoryValidationQueryParams(request: FastifyRequest) {
  const schema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  return schema.parse(request.params);
}
