import { CheckInsRepository } from "@/domain/check-ins.repository";
import { prisma } from "@/lib/prisma";
import { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async save(checkIn: CheckIn): Promise<CheckIn> {
    const response = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return response;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const response = await prisma.checkIn.create({
      data,
    });

    return response;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const response = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return response;
  }

  async countByUserId(userId: string): Promise<number> {
    const response = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return response;
  }

  async findByUserOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const response = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return response;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const response = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20, // 20 items
      skip: (page - 1) * 20,
    });

    return response;
  }
}
