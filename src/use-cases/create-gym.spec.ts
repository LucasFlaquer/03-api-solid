import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'
import { beforeEach, describe, expect, it } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'JS Gym',
      description: null,
      phone: null,
      latitude: 123.456,
      longitude: 456.123,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
