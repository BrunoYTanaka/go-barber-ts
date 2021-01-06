import { getRepository, Repository } from 'typeorm'
import IUserRepository from '@modules/users/repositories/IUserRepository'

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import User from '../entities/User'

class UsersRepository implements IUserRepository {
    private ormRepository: Repository<User>

    constructor() {
        this.ormRepository = getRepository(User)
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id)
        return user
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { email } })
        return user
    }

    public async save(user: ICreateUserDTO): Promise<User> {
        return this.ormRepository.save(user)
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const appointment = this.ormRepository.create(userData)
        await this.ormRepository.save(appointment)
        return appointment
    }
}

export default UsersRepository