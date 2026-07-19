import { BadRequestException } from '@nestjs/common';

export class Exception extends Error {
  constructor(message: string = 'Error') {
    super(message);
    throw new BadRequestException([message]);
  }
}
