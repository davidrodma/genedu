import { IsInt, Max, Min } from 'class-validator'
import { GetRecoveryCodeDto } from './get-recovery-code.dto'

export class CheckRecoveryCodeDto extends GetRecoveryCodeDto {
  @Min(10000000)
  @Max(99999999)
  @IsInt()
  code: number
}
