import { Gym } from '@prisma/client'
import { GymsRepository } from '@/domain/gyms.repository'

interface NearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface NearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class NearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLongitude,
    userLatitude,
  }: NearbyGymsUseCaseRequest): Promise<NearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      longitude: userLongitude,
      latitude: userLatitude,
    })

    return {
      gyms,
    }
  }
}
