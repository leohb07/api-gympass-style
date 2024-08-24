import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { NearbyGymsUseCase } from '../nearby-gym.usecase'

export function makeNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new NearbyGymsUseCase(gymsRepository)

  return useCase
}
