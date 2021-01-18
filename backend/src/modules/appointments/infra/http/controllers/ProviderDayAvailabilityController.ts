import { Response, Request } from 'express'
import { container } from 'tsyringe'
import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailability'

class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id } = request.params
        const { month, year, day } = request.body

        const listProviderDayAvailability = container.resolve(
            ListProviderDayAvailability,
        )

        const availability = await listProviderDayAvailability.execute({
            provider_id,
            month,
            year,
            day,
        })
        return response.json(availability)
    }
}

export default ProviderDayAvailabilityController
