import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const password_hash = await hash(password, 6)

    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new AuthenticateUseCase(usersRepository)
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new AuthenticateUseCase(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new AuthenticateUseCase(usersRepository)
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
