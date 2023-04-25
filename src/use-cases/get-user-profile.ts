import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { User } from '@prisma/client'

interface Input {
  userId: string
}
interface Output {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: Input): Promise<Output> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw new ResourceNotFoundError()
    return { user }
  }
}
