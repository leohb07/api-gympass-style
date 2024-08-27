import { FastifyRequest } from "fastify";
import { z } from "zod";

export function registerValidationBody(request: FastifyRequest) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  return schema.parse(request.body);
}
