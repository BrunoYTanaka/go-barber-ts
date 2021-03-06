import { getRepository, Repository, Raw } from 'typeorm'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO'
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO'
import Appointment from '../entities/Appointment'

class AppointmentsRepository implements IAppointmentRepository {
    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment)
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        })
        return findAppointment
    }

    public async create({
        date,
        user_id,
        provider_id,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        })
        await this.ormRepository.save(appointment)
        return appointment
    }

    public async findAllInMonthFromProvider({
        provider_id,
        year,
        month,
    }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0')
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        })
        return appointments
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        year,
        month,
    }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0')
        const parsedMonth = String(month).padStart(2, '0')
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        })
        return appointments
    }
}

export default AppointmentsRepository
