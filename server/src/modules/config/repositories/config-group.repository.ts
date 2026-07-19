import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Repository } from 'src/database/repositories/repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { DelegateArgs } from 'src/database/types/delegate-args.type';
import { DelegateReturnTypes } from 'src/database/types/delegate-return-types.type';

type ConfigGroupDelegate = Prisma.ConfigGroupDelegate<any>;

@Injectable()
export class ConfigGroupRepository extends Repository<
  ConfigGroupDelegate,
  DelegateArgs<ConfigGroupDelegate>,
  DelegateReturnTypes<ConfigGroupDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.configGroup);
  }
}
