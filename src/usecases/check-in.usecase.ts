import { CheckIn } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";
import { CheckInsRepository } from "@/domain/check-ins.repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    gymId,
    userId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserOnDate(userId, new Date());

    if (checkInOnSameDay) {
      throw new Error();
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
