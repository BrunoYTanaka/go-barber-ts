import { Response, Request } from 'express'
import { container } from 'tsyringe'
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService'

class ProviderAppointmentsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const provider_id = request.user.id
        const { day, month, year } = request.query

        const listProviderAppointments = container.resolve(
            ListProviderAppointmentsService,
        )

        const appointments = await listProviderAppointments.execute({
            provider_id,
            month: Number(month),
            year: Number(year),
            day: Number(day),
        })
        return response.json(appointments)
    }
}

export default ProviderAppointmentsController
