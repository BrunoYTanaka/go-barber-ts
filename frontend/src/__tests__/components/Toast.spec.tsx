import { act, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import ToastContainer from '../../components/ToastContainer'
import { ToastMessage } from '../../hooks/toast'

const mockedRemoveToast = jest.fn()

const mockedMessages: ToastMessage[] = [
  {
    id: 'test-id',
    title: 'test-sucesso',
    description: 'test-descrição',
  },
]

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    removeToast: mockedRemoveToast,
  }),
}))

jest.requireActual('../../hooks/toast')

describe('Toast', () => {
  it('should should show toast', () => {
    const { getByText } = render(<ToastContainer messages={mockedMessages} />)

    const toastTittle = getByText('test-sucesso')
    const toastDescription = getByText('test-descrição')

    expect(toastTittle).toBeTruthy()
    expect(toastDescription).toBeTruthy()
  })

  it('should call removeToast hook after click button', async () => {
    const { getByRole } = render(<ToastContainer messages={mockedMessages} />)

    const closeToastButton = getByRole('button')

    act(() => {
      fireEvent.click(closeToastButton)
    })

    await waitFor(() => {
      expect(mockedRemoveToast).toBeCalledWith('test-id')
    })
  })
  it('should call removeToast hook after 3s', async () => {
    jest.useFakeTimers()
    render(<ToastContainer messages={mockedMessages} />)

    jest.advanceTimersByTime(3010)

    await waitFor(() => {
      expect(mockedRemoveToast).toBeCalledWith('test-id')
    })

    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })
})
