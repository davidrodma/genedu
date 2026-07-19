import { Exception } from 'src/common/errors/Exception'
import { ConfigGroup } from '../entities/config-group.entity'

export const configGroupUpdateValidation = (group: ConfigGroup) => {
  if (group?.configs?.length > 1) {
    new Exception('You cannot delete this group because there are pending configurations')
  }
  return true
}
