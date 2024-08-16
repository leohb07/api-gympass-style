import { CheckInsRepository } from "@/domain/check-ins.repository";

interface UserMetricsUseCaseRequest {
  userId: string;
}

interface UserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class UserMetricsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({
    userId,
  }: UserMetricsUseCaseRequest): Promise<UserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    }
  }
}
