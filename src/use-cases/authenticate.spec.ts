import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let registerUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const password_hash = await hash(password, 6)

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash,
    })
    const { user } = await registerUseCase.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    const email = 'johndoe@example.com'
    await expect(() =>
      registerUseCase.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong email', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const password_hash = await hash(password, 6)
    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash,
    })
    await expect(() =>
      registerUseCase.execute({
        email,
        password: '1234562',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
