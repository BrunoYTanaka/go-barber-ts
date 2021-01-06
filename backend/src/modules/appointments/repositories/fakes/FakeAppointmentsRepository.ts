import { v4 as uuid } from 'uuid'
import { isEqual } from 'date-fns'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
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
        provider_id,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment()

        Object.assign(appointment, { id: uuid(), date, provider_id })

        this.appointments.push(appointment)

        return appointment
    }
}

export default AppointmentsRepository
