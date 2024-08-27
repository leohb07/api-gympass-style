import { FastifyRequest } from "fastify";
import { z } from "zod";

export function authenticateValidationBody(request: FastifyRequest) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  return authenticateBodySchema.parse(request.body);
}
