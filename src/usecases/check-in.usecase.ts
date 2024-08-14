import { CheckIn } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";
import { CheckInsRepository } from "@/domain/check-ins.repository";
import { GymsRepository } from "@/domain/gyms.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.util";
import { MaxDistanceError } from "./errors/max-distance.error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) { }

  async execute({
    gymId,
    userId,
    userLongitude,
    userLatitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserOnDate(userId, new Date());

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    if (!checkIn) {
      throw new InvalidCredentialsError();
    }

    return {
      checkIn,
    }
  }
}
