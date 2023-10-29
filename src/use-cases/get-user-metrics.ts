import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface Input {
  userId: string
}
interface Output {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId }: Input): Promise<Output> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }
}
