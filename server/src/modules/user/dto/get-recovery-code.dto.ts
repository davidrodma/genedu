import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class GetRecoveryCodeDto {
  @MinLength(2)
  @MaxLength(32)
  @IsString()
  @Matches(/^@[a-zA-Z0-9_]{5,32}$/, {
    message: 'The Telegram address must start with "@" and contain between 5 and 32 alphanumeric characters or "_".',
  })
  telegram: string
}
