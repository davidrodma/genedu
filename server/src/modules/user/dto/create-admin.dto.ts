import { IsEnum } from "class-validator"
import { CreateUserDto } from "./create-user.dto"
import { Role } from "@prisma/client"

export class CreateAdminDto extends CreateUserDto {
  @IsEnum(Role, {
    message: "Role Invalid.",
  })
  role: Role
}
