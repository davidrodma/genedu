import { Exception } from 'src/common/errors/Exception';
import { CreateConfigDto } from '../dto/create-config.dto';

export const configCreateValidation = (createConfigDto: CreateConfigDto) => {
  if (
    !createConfigDto?.configGroupId &&
    !createConfigDto?.groupTitle &&
    !createConfigDto?.groupDescription
  ) {
    throw new Exception('Is necessary add or choice a group');
  }
};
