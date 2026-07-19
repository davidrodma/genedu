import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isUUID(value, 'all')) {
      throw new BadRequestException('Invalid ID');
    }
    return value;
  }
}
