import { makeUserProfileUseCase } from "@/usecases/factories/make-user-profile.usecase";
import { FastifyRequest, FastifyReply } from "fastify";

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const userProfile = makeUserProfileUseCase();

  const { user } = await userProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
