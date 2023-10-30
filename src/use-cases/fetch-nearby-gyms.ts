import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface Input {
  userLatitude: number
  userLongitude: number
}

interface Output {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ userLatitude, userLongitude }: Input): Promise<Output> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
