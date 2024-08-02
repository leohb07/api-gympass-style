import { UsersRepository } from "@/domain/users.repository";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const response = await prisma.user.create({
      data,
    });

    return response;
  }

  async findByEmail(email: string) {
    const response = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    return response
  }
}
