import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Put,
  Delete,
  Query,
} from "@nestjs/common"
import { UserService } from "../services/user.service"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { CurrentUser } from "../../auth/decorators/current-user.decorator"
import { User } from "../entities/user.entity"
import { CreateAdminDto } from "../dto/create-admin.dto"
import { UpdateAdminDto } from "../dto/update-admin.dto"
import { Role } from "../../auth/enums/role.enum"
import { ChangePasswordDto } from "../dto/change-password.dto"
import { ID } from "src/database/types/id.type"
import { UpdateMyUserAdminDto } from "../dto/update-my-user-admin.dto"
import { TelegramService } from "../services/telegram.service"

@Controller("user-admin")
export class UserAdminController {
  constructor(
    private readonly service: UserService,
    private readonly telegramService: TelegramService
  ) {}

  @Post()
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.service.createAdmin(createAdminDto)
  }

  @Get("get-current-user")
  getCurrentUser(@CurrentUser() user: User) {
    return this.service.findCurrentUser(user.id, user.role)
  }

  @Get("check-verified")
  checkVerified(@CurrentUser() user: User) {
    return this.telegramService.checkVerified(user.id, user.role)
  }

  @Get()
  paginate(@Query() paginateDto: PaginateDto) {
    return this.service.paginate(paginateDto)
  }

  @Get("all")
  users() {
    return this.service.users(Role.USER)
  }

  @Get("all/active")
  usersOnlyActive() {
    return this.service.users(Role.USER, true)
  }

  @Get(":id")
  findById(@Param("id") id: ID) {
    return this.service.findById(id, true)
  }

  @Patch()
  updateMyUser(
    @Body() updateDto: UpdateMyUserAdminDto,
    @CurrentUser() user: User
  ) {
    return this.service.updateById(user.id, updateDto)
  }

  @Patch("change-password")
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User
  ) {
    return this.service.changePassword(user.id, changePasswordDto)
  }

  @Put(":id")
  updateByIdAdmin(@Param("id") id: ID, @Body() updateAdminDto: UpdateAdminDto) {
    return this.service.updateByIdAdmin(id, updateAdminDto)
  }

  @Patch("status")
  changeStatus(
    @Body() body: { ids: ID[] | ID; status: number },
    @CurrentUser() user: User
  ) {
    return this.service.changeStatus(body.ids, body.status, user)
  }

  @Delete()
  async deleteMany(
    @Body() body: { ids: ID[] | ID },
    @CurrentUser() user: User
  ) {
    return this.service.deleteMany(body.ids, user)
  }
}
