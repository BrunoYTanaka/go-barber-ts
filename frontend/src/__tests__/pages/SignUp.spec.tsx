import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import SignUp from '../../pages/SignUp'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const apiMock = new MockAdapter(api)
const mockedAddToast = jest.fn()

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

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    apiMock.onPost('users').replyOnce(200)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/')
    })
  })

  it('should not be able to sign in with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()
    })
  })

  it('should display an error if register fails', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />)

    const nameField = getByPlaceholderText('Nome')
    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Cadastrar')

    fireEvent.change(nameField, { target: { value: 'bruno' } })
    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    apiMock.onPost('users').replyOnce(500)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
