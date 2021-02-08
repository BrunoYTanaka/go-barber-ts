import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import { ToastProvider, useToast, ToastMessage } from '../../hooks/toast'

const mockedToastMessage: Omit<ToastMessage, 'id'> = {
  title: 'Error',
  description: 'descrição de erro',
  type: 'error',
}
const mockedToastMessage2: Omit<ToastMessage, 'id'> = {
  title: 'Sucesso',
  description: 'descrição de sucesso',
  type: 'success',
}
const mockedToastMessage3: Omit<ToastMessage, 'id'> = {
  title: 'Info',
  description: 'descrição de info',
}

describe('toast hook', () => {
  it('should able to add toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    })
    act(() => {
      result.current.addToast(mockedToastMessage)
      result.current.addToast(mockedToastMessage2)
      result.current.addToast(mockedToastMessage3)
    })

    expect(result.current.messages).toMatchObject([
      mockedToastMessage,
      mockedToastMessage2,
      mockedToastMessage3,
    ])
  })
  it('should able to remove toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    })
    act(() => {
      result.current.addToast(mockedToastMessage)
      result.current.addToast(mockedToastMessage2)
      result.current.addToast(mockedToastMessage3)
    })

    expect(result.current.messages).toMatchObject([
      mockedToastMessage,
      mockedToastMessage2,
      mockedToastMessage3,
    ])

    act(() => {
      result.current.removeToast(result.current.messages[1].id) // remove 2 message
    })

    expect(result.current.messages).not.toMatchObject([
      mockedToastMessage,
      mockedToastMessage2,
      mockedToastMessage3,
    ])
    expect(result.current.messages).toMatchObject([
      mockedToastMessage,
      mockedToastMessage3,
    ])
  })
})
