import MockAdapter from 'axios-mock-adapter'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import Dashboard from '../../pages/Dashboard'
import api from '../../services/api'

const mockApi = new MockAdapter(api)

// let datePickerMock: HTMLElement
let titleField: HTMLElement

const mockedAuthUser = {
  name: 'Geral The Rivia',
  email: 'geraldinho@examplo.com',
  id: 'id-test',
  avatar_url: 'avatar-auth-user.png',
}

const mockedMorningClient = {
  id: 'test-id',
  user: {
    name: 'Cliente parte manhã',
    avatar_url: 'avatar.jpg',
  },
  date: '2021-01-01T13:00:00.000Z', // 01/01/2020 09:00
}
const mockedAfternoonClient = {
  id: 'test-id-2',
  user: {
    name: 'Cliente parte da tarde',
    avatar_url: 'avatar2.jpg',
  },
  date: '2021-01-01T20:00:00.000Z', // 01/01/2020 16:00
}

const eachDayArray = Array.from(
  {
    length: 31,
  },
  (_, index) => index + 1,
)

const unavailableDays = [3, 10, 17, 24]

const availability = eachDayArray.map(day => {
  return {
    day,
    available: !unavailableDays.includes(day),
  }
})

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    user: mockedAuthUser,
  }),
}))

jest.mock('date-fns/esm/locale', () => ({
  ptBR: jest.fn().mockReturnValue({}),
}))

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

// 01/01/2020 08:00
jest.useFakeTimers('modern').setSystemTime(new Date(2021, 0, 1, 8))

describe('Page Dashboard', () => {
  beforeEach(() => {
    mockApi
      .onGet(`/providers/${mockedAuthUser.id}/month-availability`)
      .reply(200, availability)
    mockApi
      .onGet('/appointments/me')
      .reply(200, [mockedMorningClient, mockedAfternoonClient])
  })

  it('should be able to show header with current user logged', async () => {
    const { getByText, getByAltText } = render(<Dashboard />)

    await waitFor(() => {
      const imageTag = getByAltText(mockedAuthUser.name) as HTMLImageElement
      const userName = getByText(mockedAuthUser.name)
      expect(imageTag.src).toContain(mockedAuthUser.avatar_url)
      expect(userName).toBeInTheDocument()
    })
  })

  it('should be able to show "Horários agendados" section', async () => {
    const { getByText } = render(<Dashboard />)
    titleField = getByText('Horários agendados')
    await waitFor(() => {
      expect(titleField).toBeTruthy()
    })
  })

  it('should be able to show "Atendimento a seguir" section', async () => {
    const { getByText } = render(<Dashboard />)
    await waitFor(() => getByText('Atendimento a seguir'))
    expect(getByText('Atendimento a seguir')).toBeInTheDocument()
  })

  it('should be able to show "Manhã" section with some appointments', async () => {
    const { queryByText, getAllByAltText } = render(<Dashboard />)
    await waitFor(() => queryByText('Manhã'))
    const [, imageTag] = getAllByAltText(
      mockedMorningClient.user.name,
    ) as HTMLImageElement[]
    expect(queryByText('Nenhum agendamento no perído da manhã')).toBeNull()
    expect(imageTag.src).toContain(mockedMorningClient.user.avatar_url)
  })

  it('should be able to show "Tarde" section with some appointments', async () => {
    const { queryByText, getAllByAltText } = render(<Dashboard />)
    await waitFor(() => queryByText('Tarde'))
    const [imageTag] = getAllByAltText(
      mockedAfternoonClient.user.name,
    ) as HTMLImageElement[]
    expect(queryByText('Nenhum agendamento no perído da tarde')).toBeNull()
    expect(imageTag.src).toContain(mockedAfternoonClient.user.avatar_url)
  })

  it('should be able to render Calendar', async () => {
    const { getByTestId } = render(<Dashboard />)
    let calendar
    await waitFor(() => {
      calendar = getByTestId('calendar')
    })

    expect(calendar).toBeInTheDocument()
  })
})
