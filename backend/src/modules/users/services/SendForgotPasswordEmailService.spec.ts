import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import FakeEmailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'

let fakeUsersRepository: FakeUsersRepository
let fakeEmailProvider: FakeEmailProvider
let fakeUserTokensRepository: FakeUserTokensRepository

let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeEmailProvider = new FakeEmailProvider()
        fakeUserTokensRepository = new FakeUserTokensRepository()
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeEmailProvider,
            fakeUserTokensRepository,
        )
    })

    it('should be able to recover the password with the email', async () => {
        const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail')

        await fakeUsersRepository.create({
            email: 'email@email.com',
            name: 'John Doe',
            password: '123456',
        })

        await sendForgotPasswordEmail.execute({
            email: 'email@email.com',
        })
        expect(sendMail).toHaveBeenCalled()
    })

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'email@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

        const user = await fakeUsersRepository.create({
            email: 'email@email.com',
            name: 'John Doe',
            password: '123456',
        })

        await sendForgotPasswordEmail.execute({
            email: 'email@email.com',
        })
        expect(generateToken).toHaveBeenCalledWith(user.id)
    })
})
