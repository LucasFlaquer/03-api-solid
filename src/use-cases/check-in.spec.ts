import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '@/use-cases/checkin'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4906488),
      longitude: new Decimal(-47.4274511),
    })
  })
  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4906488,
      userLongitude: -47.4274511,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4906488,
      userLongitude: -47.4274511,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.4906488,
        userLongitude: -47.4274511,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4906488,
      userLongitude: -47.4274511,
    })
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4906488,
      userLongitude: -47.4274511,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4813998),
      longitude: new Decimal(-47.4336966),
    })
    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.4851848,
        userLongitude: -47.4346492,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})
