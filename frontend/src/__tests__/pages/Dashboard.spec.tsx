import MockAdapter from 'axios-mock-adapter'
import { screen, render, waitFor, act } from '@testing-library/react'
import React from 'react'
import Dashboard from '../../pages/Dashboard'
import api from '../../services/api'

const mockApi = new MockAdapter(api)

// let datePickerMock: HTMLElement
let titleField: HTMLElement

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => {
      return {
        user: {
          name: 'Jhonh Doe',
          email: 'jhonhDoe@examplo.com',
          id: 'test',
        },
      }
    },
  }
})

jest.mock('date-fns/esm/locale', () => {
  return {
    ptBR: jest.fn().mockReturnValue({}),
  }
})
jest.mock('date-fns', () => {
  return {
    isToday: () => true,
    format: jest.fn(),
    isAfter: () => true,
    parseISO: () => ({
      getHours: jest.fn(),
    }),
  }
})

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 0, 1, 7))

describe('Page Dashboard', () => {
  it('should be able to show "Horários agendados" section', async () => {
    mockApi.onGet('/providers/test/month-availability').reply(200, [
      {
        day: 1,
        available: false,
      },
      {
        day: 2,
        available: false,
      },
    ])
    mockApi.onGet('/appointments/me').reply(200, [
      {
        id: 'test-id',
        user: {
          name: 'name-user',
          avatar_url: 'avatar.jpg',
        },
        date: '2021-01-1',
      },
    ])
    const { getByText } = render(<Dashboard />)
    titleField = getByText('Horários agendados')
    await waitFor(() => {
      expect(titleField).toBeTruthy()
    })
  })
  it('should be able to show "Atendimento a seguir" section', async () => {
    act(() => {
      mockApi.onGet('/providers/test/month-availability').reply(200, [
        {
          day: 1,
          available: false,
        },
        {
          day: 2,
          available: false,
        },
      ])
      mockApi.onGet('/appointments/me').reply(200, [
        {
          id: 'test-id',
          user: {
            name: 'name-user',
            avatar_url: 'avatar.jpg',
          },
          date: '2021-01-1',
        },
      ])
    })

    render(<Dashboard />)
    await waitFor(() => screen.getByText('Atendimento a seguir'))
    expect(screen.getByText('Atendimento a seguir')).toBeInTheDocument()
  })
})
