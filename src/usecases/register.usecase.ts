import { UsersRepository } from "@/domain/users.repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

interface IRegisterUseCase {
  name: string
  email: string
  password: string
}


export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) { }

  async execute({ name, email, password }: IRegisterUseCase) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({ name, email, password_hash });
  }
}
