import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        )
    })
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456',
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John TrÊ',
            email: 'email_trocado@email.com',
        })

        expect(updatedUser.name).toBe('John TrÊ')
        expect(updatedUser.email).toBe('email_trocado@email.com')
    })
    it('should be not able to update the profile from non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing-user-id',
                name: 'John TrÊ',
                email: 'email_trocado@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError)
    })
    it('should be able to change to another user', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456',
        })
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'teste@email.com',
            password: '123456',
        })

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John TrÊ',
                email: 'email@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError)
    })
    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123123',
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John TrÊ',
            email: 'email_trocado@email.com',
            password: '123123',
            old_password: '123123',
        })

        expect(updatedUser.password).toBe('123123')
    })
    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456',
        })

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John TrÊ',
                email: 'email_trocado@email.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError)
    })
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'email@email.com',
            password: '123456',
        })

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John TrÊ',
                email: 'email_trocado@email.com',
                password: '123123',
                old_password: 'wrong-old-password',
            }),
        ).rejects.toBeInstanceOf(AppError)
    })
})
