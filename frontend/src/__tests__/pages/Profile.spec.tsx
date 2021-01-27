import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import user from '@testing-library/user-event'
import Profile from '../../pages/Profile'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const apiMock = new MockAdapter(api)
const mockedAddToast = jest.fn()

const mockResponse = {
  name: 'bruno',
  email: 'bruno@email.com',
  old_password: '123',
  password: '123456',
  password_confirmation: '123456',
}

const mockUser = {
  name: 'andre',
  email: 'andre@email.com',
}

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}))

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    user: mockUser,
    updateUser: jest.fn(),
  }),
}))

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })

  it('should be able to update profile with name and email', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')

    const buttonElement = getByText('Confirmar mudanças')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })

    fireEvent.click(buttonElement)

    apiMock.onPut('profile').replyOnce(200, mockResponse)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should be able to update profile with all new infos', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const oldPasswordField = getByPlaceholderText('Senha atual')
    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha')

    const buttonElement = getByText('Confirmar mudanças')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(oldPasswordField, { target: { value: '123' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    apiMock.onPut('profile').replyOnce(200, mockResponse)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should not be able to update profile with different password and password confirmation', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const oldPasswordField = getByPlaceholderText('Senha atual')
    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha')

    const buttonElement = getByText('Confirmar mudanças')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(oldPasswordField, { target: { value: '123' } })
    fireEvent.change(passwordField, { target: { value: '1234' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      )
    })
  })

  it('should display error when update profile fails', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const oldPasswordField = getByPlaceholderText('Senha atual')
    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha')

    const buttonElement = getByText('Confirmar mudanças')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(oldPasswordField, { target: { value: '123' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    apiMock.onPut('profile').replyOnce(500)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })

  it('should be able to update avatar profile', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    const { getByTestId } = render(<Profile />)

    const avatarField = getByTestId('avatar-input') as HTMLInputElement
    user.upload(avatarField, file)

    apiMock.onPatch('users/avatar').replyOnce(200, mockResponse)

    expect(avatarField.files).toHaveLength(1)
    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      )
    })
  })

  it('should not be able to update avatar profile when not passed any image', async () => {
    const { getByTestId } = render(<Profile />)

    const avatarField = getByTestId('avatar-input') as HTMLInputElement
    // user.upload(avatarField, undefined)

    fireEvent.change(avatarField, { target: { files: null } })

    apiMock.onPatch('users/avatar').replyOnce(200, mockResponse)

    expect(avatarField.files).toBe(null)
  })
})
