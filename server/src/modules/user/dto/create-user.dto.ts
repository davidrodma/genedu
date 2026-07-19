import { IsUnique } from "src/common/validation/is-unique.validator"
import { User } from "../entities/user.entity"
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator"
import { Match } from "src/common/validation/match.validator"
import { Exception } from "src/common/errors/Exception"

export class CreateUserDto extends User {
  @IsEmail()
  @MaxLength(500)
  @IsUnique({ tableName: "user", column: "email" })
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password too weak. The password must have a number, lowercase and uppercase letters and at least one special character.",
  })
  password: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match("password")
  passwordConfirm: string

  @MinLength(2)
  @MaxLength(255)
  @IsString()
  name: string

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  @IsString()
  @Matches(/^@[a-zA-Z0-9_]{5,32}$/, {
    message:
      'The Telegram address must start with "@" and contain between 5 and 32 alphanumeric characters or "_".',
  })
  @IsUnique({ tableName: "user", column: "telegram" })
  telegram: string
}
