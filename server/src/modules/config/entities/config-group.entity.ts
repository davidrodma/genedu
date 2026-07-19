import { StatusDefault } from 'src/common/enums/status.default.enum';
import { Config } from './config.entity';

export class ConfigGroup {
  id?: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: StatusDefault;
  configs?: Config[];
}
