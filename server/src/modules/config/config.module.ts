import { Module } from '@nestjs/common'
import { ConfigService } from './services/config.service'
import { ConfigController } from './controllers/config.controller'
import { PrismaModule } from 'src/database/prisma/prisma.module'
import { ConfigRepository } from './repositories/config.repository'
import { IsUniqueConstraint } from 'src/common/validation/is-unique.validator'
import { ConfigGroupService } from './services/config-group.service'
import { ConfigGroupRepository } from './repositories/config-group.repository'
import { ConfigGroupController } from './controllers/config-group.controller'

@Module({
  imports: [PrismaModule],
  controllers: [ConfigController, ConfigGroupController],
  providers: [ConfigService, ConfigRepository, ConfigGroupService, ConfigGroupRepository, IsUniqueConstraint],
  exports: [ConfigService, ConfigRepository, ConfigGroupService, ConfigGroupRepository],
})
export class ConfigModule {}

