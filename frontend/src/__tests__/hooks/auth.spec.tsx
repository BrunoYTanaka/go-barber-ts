import { renderHook } from '@testing-library/react-hooks'
import MockAdapter from 'axios-mock-adapter'
import { act } from 'react-dom/test-utils'
import { AuthProvider, useAuth } from '../../hooks/auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('auth hook', () => {
  it('should able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'Bruno',
        email: 'bruno@email.com',
      },
      token: 'token-123',
    }
    apiMock.onPost('sessions').replyOnce(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'bruno@email.com',
      password: '123456',
    })

    await waitForNextUpdate()

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    )
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    )
    expect(result.current.user.email).toEqual('bruno@email.com')
  })

  it('should be able to restore saved data from storage when auth inits', () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        switch (key) {
          case '@GoBarber:token':
            return 'token-123'
          case '@GoBarber:user':
            return JSON.stringify({
              id: 'user123',
              name: 'Bruno',
              email: 'bruno@email.com',
            })
          default:
            return null
        }
      })
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('bruno@email.com')
  })

  it('should able to sign out', async () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        switch (key) {
          case '@GoBarber:token':
            return 'token-123'
          case '@GoBarber:user':
            return JSON.stringify({
              id: 'user123',
              name: 'Bruno',
              email: 'bruno@email.com',
            })
          default:
            return null
        }
      })
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signOut()
    })

    expect(result.current.user).toBeUndefined()
    expect(removeItemSpy).toHaveBeenCalledTimes(2)
  })

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    const user = {
      id: 'user123',
      name: 'Bruno',
      email: 'bruno@email.com',
      avatar_url: 'img-test.jpg',
    }

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )
    expect(result.current.user.email).toEqual(user.email)
  })
})
