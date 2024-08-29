import { UserAlreadyExistsError } from "@/usecases/errors/user-already-exists.error";
import { makeRegisterUseCase } from "@/usecases/factories/make-register.usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { registerValidationBody } from "./validations/register.validation";
import { makeUserProfileUseCase } from "@/usecases/factories/make-user-profile.usecase";
import { makeAuthenticateUseCase } from "@/usecases/factories/make-authenticate.usecase";
import { authenticateValidationBody } from "./validations/authenticate.validation";
import { InvalidCredentialsError } from "@/usecases/errors/invalid-credentials.error";

export class UsersController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password } = registerValidationBody(request);

    try {
      const registerUseCase = makeRegisterUseCase();

      await registerUseCase.execute({
        name,
        email,
        password,
      });
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: err.message,
        });
      }

      throw err;
    }

    return reply.status(201).send();
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
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

  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = authenticateValidationBody(request);

    try {
      const authenticateUseCase = makeAuthenticateUseCase();

      const { user } = await authenticateUseCase.execute({
        email,
        password,
      });

      const token = await reply.jwtSign(
        { role: user.role },
        {
          sign: {
            sub: user.id,
          },
        },
      );

      const refreshToken = await reply.jwtSign(
        { role: user.role },
        {
          sign: {
            sub: user.id,
            expiresIn: "7d",
          },
        },
      );

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        });
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: err.message,
        });
      }

      throw err;
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true });

    const { role } = request.user;

    const token = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  }
}
