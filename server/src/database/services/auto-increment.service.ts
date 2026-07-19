import { Injectable } from '@nestjs/common'
import { AutoIncrementRepository } from '../repositories/auto-increment.repository'
import { AutoIncrement } from '../entities/auto-increment.entity'

@Injectable()
export class AutoIncrementService {
  constructor(private readonly repository: AutoIncrementRepository) {}

  async nextAutoincrement(name: string) {
    let autoIncrement: AutoIncrement = null
    try {
      autoIncrement = await this.repository.update({
        where: {
          name,
        },
        data: {
          count: { increment: 1 },
        },
      })
    } catch (e) {
      autoIncrement = await this.repository.create({ data: { name, count: 1 } })
    }
    return autoIncrement.count
  }
}
