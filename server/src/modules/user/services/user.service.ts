import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { CreateUserDto } from "../dto/create-user.dto"
import { User } from "../entities/user.entity"
import {
  UserRepository,
  UserWhereUniqueInput,
} from "../repositories/user.repository"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { UpdateUserDto } from "../dto/update-user.dto"
import { CreateAdminDto } from "../dto/create-admin.dto"
import { UpdateAdminDto } from "../dto/update-admin.dto"
import { ChangePasswordDto } from "../dto/change-password.dto"
import { ID } from "src/database/types/id.type"
import { Role } from "src/modules/auth/enums/role.enum"
import { StatusDefault } from "src/common/enums/status.default.enum"
import { Exception } from "src/common/errors/Exception"
import { ChangeRecoveryPasswordDto } from "../dto/change-recovery-password.dto"

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  async create(createDto: CreateUserDto): Promise<{ user: User }> {
    const password = await this.hashPassword(createDto.password)
    const data: any = {
      ...createDto,
      password,
      passwordConfirm: undefined,
      role: Role.ADMIN,
    }
    const createdUser = await this.repository.create({ data })

    return {
      user: {
        ...createdUser,
        password: undefined,
      },
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    const password = await this.hashPassword(createAdminDto.password)
    const data: any = {
      ...createAdminDto,
      password,
      passwordConfirm: undefined,
    }

    const createdUser = await this.repository.create({ data })

    return {
      ...createdUser,
      password: undefined,
    }
  }

  async findByEmail(email: string) {
    return await this.repository.findUnique({ where: { email } })
  }

  async findByTelegram(telegram: string) {
    return await this.repository.findFirst({
      where: { telegram: `@${telegram.replace("@", "")}` },
    })
  }

  async findCurrentUser(id: ID, role: string) {
    const user = await this.repository.findUnique({
      where: {
        id,
      },
    })
    return { ...user, password: undefined, chatId: undefined, code: undefined }
  }

  async paginate(paginateDto: PaginateDto) {
    let paginate = await this.repository.paginate<User>({
      paginateDto,
      fieldsSearch: ["email", "name", "telegram"],
    })
    paginate.list = paginate.list.map((obj: User) => {
      return { ...obj, password: undefined }
    })
    return paginate
  }

  async updateById(id: ID, updateDto: UpdateUserDto) {
    if (updateDto?.telegram) {
      const old = await this.repository.findById(id)
      if (old.telegram != updateDto.telegram) {
        updateDto = { ...updateDto, isVerified: false }
      }
    }
    const obj = await this.repository.updateById(id, updateDto)
    return { ...obj, password: undefined }
  }

  async updateByIdAdmin(id: ID, updateDto: UpdateAdminDto) {
    let update = updateDto
    if (updateDto.password) {
      const password = await this.hashPassword(updateDto.password)
      update = {
        ...updateDto,
        password,
        passwordConfirm: undefined,
      }
    }
    const obj = await this.repository.updateById(id, update)
    return { ...obj, password: undefined }
  }

  async findUnique(where: UserWhereUniqueInput) {
    return await this.repository.findUnique<User>({ where })
  }

  async changePassword(id: ID, updateDto: ChangePasswordDto) {
    const user = await this.findById(id)
    if (!user) {
      throw new Exception("User Not Found")
    }
    const isPasswordValid = await bcrypt.compare(
      updateDto.passwordOld,
      user.password
    )
    if (!isPasswordValid) {
      throw new Exception("Incorrect Old Password")
    }
    const password = await this.hashPassword(updateDto.password)
    const obj = await this.repository.updateById(id, {
      ...updateDto,
      password,
      passwordConfirm: undefined,
      passwordOld: undefined,
    })
    return { ...obj, password: undefined }
  }

  async findById(id: ID, removePassword = false) {
    const obj = await this.repository.findById(id)
    return removePassword ? { ...obj, password: undefined } : obj
  }

  async changeStatus(ids: ID[] | ID, status: number, userLogged: User) {
    return await this.repository.statusUsers(ids, status, userLogged)
  }

  async deleteMany(ids: ID[] | ID, userLogged: User) {
    return this.repository.deleteUsers(ids, userLogged)
  }

  async users(role: Role = Role.USER, onlyActive: boolean = false) {
    const where = onlyActive
      ? { role, status: StatusDefault.ENABLED }
      : { role }
    return this.repository.findMany({
      where,
      orderBy: {
        email: "asc",
      },
    })
  }

  generateConfirmationCode(): number {
    return Math.floor(10000000 + Math.random() * 90000000)
  }

  async checkRecoveryCode(telegramUsername: string, code: number) {
    const user = await this.findByTelegram(telegramUsername)
    if (user && code && user.code === code) {
      const minutes = 15
      const minutesAgo = new Date(Date.now() - minutes * 60 * 1000)
      const expired = user.updatedAt < minutesAgo
      if (expired) {
        return {
          error: "The confirmation code is expired! Request a new code again!",
        }
      }
      return { success: true, userId: user.id }
    }

    return { error: "The confirmation code does not match what was sent" }
  }

  async changeRecoveryPassword(updateDto: ChangeRecoveryPasswordDto) {
    const check = await this.checkRecoveryCode(
      updateDto.telegram,
      updateDto.code
    )
    if (check?.error) {
      return check
    }
    if (check?.success) {
      const password = await this.hashPassword(updateDto.password)
      const user = await this.repository.updateById(check.userId, {
        ...updateDto,
        password,
        passwordConfirm: undefined,
      })
      return { success: true, userId: user.id }
    }
    return { error: "Unexpected error!" }
  }
}
