import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Match } from 'src/common/validation/match.validator'
import { CheckRecoveryCodeDto } from './check-recovery-code.dto'

export class ChangeRecoveryPasswordDto extends CheckRecoveryCodeDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Your New Password too weak. The password must have a number, lowercase and uppercase letters and at least one special character.',
  })
  password: string

  @Match('password')
  passwordConfirm: string
}
