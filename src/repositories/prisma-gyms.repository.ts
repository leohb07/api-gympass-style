import { FindManyNearbyParams, GymsRepository } from "@/domain/gyms.repository";
import { prisma } from "@/lib/prisma";
import { Gym, Prisma } from "@prisma/client";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const response = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return response;
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const response = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return response;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const response = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return response;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const response = await prisma.gym.create({
      data,
    });

    return response;
  }
}
