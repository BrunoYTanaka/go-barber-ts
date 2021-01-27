import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import RouteData from 'react-router-dom'

import ResetPassword from '../../pages/ResetPassword'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const mockedAddToast = jest.fn()
const apiMock = new MockAdapter(api)

const mockLocation = {
  withToken: {
    pathname: '',
    hash: '',
    search: '?token=new-token',
    state: '',
  },

  withoutToken: {
    pathname: '',
    hash: '',
    search: '',
    state: '',
  },
}

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  useLocation: () => ({
    search: '',
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}))

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })
  it('should be able to reset password', async () => {
    jest.spyOn(RouteData, 'useLocation').mockReturnValue(mockLocation.withToken)
    const { getByPlaceholderText, getByText } = render(<ResetPassword />)

    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    )
    const buttonElement = getByText('Alterar senha')

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })
    fireEvent.click(buttonElement)

    apiMock.onPost('password/reset').replyOnce(200)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/')
    })
  })
  it('should not be able to reset password when confirmation password is different from new password', async () => {
    jest.spyOn(RouteData, 'useLocation').mockReturnValue(mockLocation.withToken)
    const { getByPlaceholderText, getByText } = render(<ResetPassword />)

    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    )
    const buttonElement = getByText('Alterar senha')

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'diff-password' },
    })
    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/')
    })
  })

  it('should display error if does not have token', async () => {
    jest
      .spyOn(RouteData, 'useLocation')
      .mockReturnValue(mockLocation.withoutToken)
    const { getByPlaceholderText, getByText } = render(<ResetPassword />)

    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    )
    const buttonElement = getByText('Alterar senha')

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })
    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })

  it('should display error if reset password fails', async () => {
    jest.spyOn(RouteData, 'useLocation').mockReturnValue(mockLocation.withToken)
    const { getByPlaceholderText, getByText } = render(<ResetPassword />)

    const passwordField = getByPlaceholderText('Nova senha')
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    )
    const buttonElement = getByText('Alterar senha')

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })
    fireEvent.click(buttonElement)

    apiMock.onPost('password/reset').replyOnce(500)
    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
