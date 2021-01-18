import { v4 as uuid } from 'uuid'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO'
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO'
import Appointment from '../../infra/typeorm/entities/Appointment'

class AppointmentsRepository implements IAppointmentRepository {
    private appointments: Appointment[] = []

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        )
        return findAppointment
    }

    public async create({
        date,
        user_id,
        provider_id,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment()

        Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

        this.appointments.push(appointment)

        return appointment
    }

    public async findAllInMonthFromProvider({
        provider_id,
        year,
        month,
    }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            )
        })
        return appointments
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        year,
        month,
    }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            )
        })
        return appointments
    }
}

export default AppointmentsRepository
