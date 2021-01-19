import { injectable, inject } from 'tsyringe'
import IAppointmentRepository from '../repositories/IAppointmentsRepository'
import Appointment from '../infra/typeorm/entities/Appointment'

interface IRequest {
    provider_id: string
    month: number
    year: number
    day: number
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentRepository,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        )
        return appointments
    }
}

export default ListProviderAppointmentsService
