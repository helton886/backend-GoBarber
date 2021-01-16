import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('AuthenticateUser', () => {
  it('should be able to authenticated', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    const response = await authenticateUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticated with wrong email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    await expect(
      authenticateUserService.execute({
        email: 'helton1@gmail.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticated with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'helton@gmail.com',
      password: '12341234',
      name: 'Helton Alves',
    });

    await expect(
      authenticateUserService.execute({
        email: 'helton@gmail.com',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticated with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: 'helton@gmail.com',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
