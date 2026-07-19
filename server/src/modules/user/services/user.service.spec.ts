import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'

import { Role, User } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'
import { UserRepository } from '../repositories/user.repository'

let titleTest = 'UserService'

describe(titleTest, () => {
  let service: UserService
  let obj = null
  const params: any = {
    name: 'Name Test',
    password: 'Password Test',
    email: 'test@test.com',
    role: Role.USER,
  }
  const updateParams = { ...params, name: 'Name Test 2 Updated' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserService, UserRepository],
    }).compile()
    service = module.get<UserService>(UserService)
  })

  it(`${titleTest}.create`, async () => {
    obj = await service.create(params)
    expect(obj).toEqual(expect.objectContaining(params))
  })
  it(`${titleTest}.updateById`, async () => {
    obj = await service.updateById(obj.id, updateParams)
    expect(obj).toEqual(expect.objectContaining(updateParams))
  })
  it(`${titleTest}.findById`, async () => {
    const id = obj.id
    obj = await service.findById(id)
    expect(obj.id).toEqual(id)
  })
})

