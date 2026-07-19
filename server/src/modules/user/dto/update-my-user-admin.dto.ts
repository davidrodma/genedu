import { IsUnique } from 'src/common/validation/is-unique.validator'
import { User } from '../entities/user.entity'
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { Match } from 'src/common/validation/match.validator'

export class UpdateMyUserAdminDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(4)
  @MaxLength(500)
  @IsUnique({ tableName: 'user', column: 'email' })
  email?: string

  @MinLength(2)
  @MaxLength(255)
  @IsString()
  name: string

  @MaxLength(500)
  @IsUrl()
  @IsOptional()
  @IsString() // Verifica que o campo é uma string
  @ValidateIf((obj, value) => value !== '') // Valida somente se a string não estiver vazia
  panelUrl?: string

  @IsOptional()
  @IsNotEmpty({ message: 'O Telegram não pode ser vazio.' })
  @MinLength(2, { message: 'O Telegram deve ter no mínimo 2 caracteres.' })
  @MaxLength(32, { message: 'O Telegram deve ter no máximo 32 caracteres.' })
  @IsUnique({ tableName: 'user', column: 'telegram' })
  @IsString()
  @Matches(/^@[a-zA-Z0-9_]{5,32}$/, {
    message: 'The Telegram address must start with "@" and contain between 5 and 32 alphanumeric characters or "_".',
  })
  telegram?: string
}
