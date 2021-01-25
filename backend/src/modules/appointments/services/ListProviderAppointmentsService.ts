import { injectable, inject } from 'tsyringe'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
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
        @inject('CacheProvider')
        private chaceProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<Appointment[]> {
        const cachekey = `provider-appointments:${provider_id}:${year}-${month}-${day}`
        let appointments = await this.chaceProvider.recover<Appointment[]>(
            cachekey,
        )
        if (!appointments) {
            appointments = await this.appointmentRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    year,
                    month,
                    day,
                },
            )
            await this.chaceProvider.save(cachekey, appointments)
        }
        return appointments
    }
}

export default ListProviderAppointmentsService
