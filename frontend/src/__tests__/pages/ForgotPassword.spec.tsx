import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'

import ForgotPassword from '../../pages/ForgotPassword'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const mockedAddToast = jest.fn()
const apiMock = new MockAdapter(api)

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}))

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
    mockedAddToast.mockClear()
  })
  it('should be able to send forgot password email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />)

    const emailField = getByPlaceholderText('E-mail')

    const buttonElement = getByText('Recuperar')

    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.click(buttonElement)

    apiMock.onPost('password/forgot').replyOnce(200)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      )
    })
  })
  it('should not be able to send forgot password email with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />)

    const emailField = getByPlaceholderText('E-mail')

    const buttonElement = getByText('Recuperar')

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      )
    })
  })
  it('should display error if forgot password email fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />)

    const emailField = getByPlaceholderText('E-mail')

    const buttonElement = getByText('Recuperar')

    fireEvent.change(emailField, { target: { value: 'bruno@email.com' } })
    fireEvent.click(buttonElement)

    apiMock.onPost('password/forgot').replyOnce(500)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
