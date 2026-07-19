import { Body, Controller, Get, Post, Param, Patch, Put, Delete, Query } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UserService } from '../services/user.service'
import { Public } from 'src/modules/auth/decorators/is-public.decorator'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import { User } from '../entities/user.entity'
import { Role } from '../../auth/enums/role.enum'
import { Roles } from '../../auth/decorators/roles.decorator'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { TelegramService } from '../services/telegram.service'
import { GetRecoveryCodeDto } from '../dto/get-recovery-code.dto'
import { CheckRecoveryCodeDto } from '../dto/check-recovery-code.dto'
import { ChangeRecoveryPasswordDto } from '../dto/change-recovery-password.dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post()
  @Public()
  create(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto)
  }

  @Get('get-current-user')
  @Roles(Role.USER)
  getCurrentUser(@CurrentUser() user: User) {
    return this.service.findCurrentUser(user.id, user.role)
  }

  @Get('check-verified')
  @Roles(Role.USER)
  checkVerified(@CurrentUser() user: User) {
    return this.telegramService.checkVerified(user.id, user.role)
  }

  @Patch()
  @Roles(Role.USER)
  updateMyUser(@Body() updateDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.service.updateById(user.id, updateDto)
  }

  @Patch('change-password')
  @Roles(Role.USER)
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user: User) {
    return this.service.changePassword(user.id, changePasswordDto)
  }

  @Post('get-recovery-code')
  @Public()
  getRecoveryCode(@Body() recoveryDto: GetRecoveryCodeDto) {
    return this.telegramService.getRecoveryCode(recoveryDto.telegram)
  }

  @Post('check-recovery-code')
  @Public()
  checkRecoveryCode(@Body() recoveryDto: CheckRecoveryCodeDto) {
    return this.service.checkRecoveryCode(recoveryDto.telegram, recoveryDto.code)
  }

  @Patch('change-recovery-password')
  @Public()
  changeRecoveryPassword(@Body() changePasswordDto: ChangeRecoveryPasswordDto) {
    return this.service.changeRecoveryPassword(changePasswordDto)
  }
}
