import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isNumberString } from 'class-validator';

@Injectable()
export class NumberStringPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isNumberString(value)) {
      throw new BadRequestException('Invalid Number/Integer/ID');
    }
    return value;
  }
}
