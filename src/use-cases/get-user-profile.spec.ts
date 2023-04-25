import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const password_hash = await hash(password, 6)

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash,
    })
    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })
  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
