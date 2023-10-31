import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

interface Input {
  checkInId: string
}
interface Output {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ checkInId }: Input): Promise<Output> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) throw new ResourceNotFoundError()
    const distanceInMinutesFromCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )
    if (distanceInMinutesFromCreation > 20)
      throw new LateCheckInValidationError()
    checkIn.validated_at = new Date()
    this.checkInsRepository.save(checkIn)
    return { checkIn }
  }
}
