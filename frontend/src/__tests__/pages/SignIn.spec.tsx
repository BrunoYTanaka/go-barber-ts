import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn()
const mockedSignIn = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}))

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}))

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(passwordField, { target: { value: '12345' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should not be able to sign in with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.change(passwordField, { target: { value: '12345' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()
    })
  })
  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error()
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.change(passwordField, { target: { value: '12345' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
