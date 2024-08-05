import { UsersRepository } from "@/domain/users.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { User } from "@prisma/client";

interface UserProfileUseCaseRequest {
  userId: string;
}

interface UserProfileUseCaseResponse {
  user: User;
}

export class UserProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId
  }: UserProfileUseCaseRequest): Promise<UserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    }
  }
}
