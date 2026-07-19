import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

export class LoginRequestBody {
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
