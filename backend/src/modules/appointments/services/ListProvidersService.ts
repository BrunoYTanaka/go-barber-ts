import { injectable, inject } from 'tsyringe'
import User from '@modules/users/infra/typeorm/entities/User'
import IUserRepository from '@modules/users/repositories/IUserRepository'

interface IRequest {
    user_id: string
}
@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        const user = await this.usersRepository.findAllProvider({
            except_user_id: user_id,
        })
        return user
    }
}

export default ListProvidersService
