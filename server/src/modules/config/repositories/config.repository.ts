import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Repository } from 'src/database/repositories/repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DelegateArgs } from 'src/database/types/delegate-args.type';
import { DelegateReturnTypes } from 'src/database/types/delegate-return-types.type';

type ConfigDelegate = Prisma.ConfigDelegate<any>;

@Injectable()
export class ConfigRepository extends Repository<
  ConfigDelegate,
  DelegateArgs<ConfigDelegate>,
  DelegateReturnTypes<ConfigDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.config);
  }
}
