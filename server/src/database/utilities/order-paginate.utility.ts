import { PaginateDto } from 'src/common/dto/paginate.dto'

export function orderPaginate({
  paginateDto,
  allowedOrderFields = [],
}: {
  paginateDto: PaginateDto
  allowedOrderFields?: string[]
}) {
  if (paginateDto.order) {
    let order = paginateDto.order
    const checkAllowed = allowedOrderFields.length ? true : false
    for (const field of Object.keys(order)) {
      if (checkAllowed && !allowedOrderFields.includes(field)) {
        delete order[field]
      } else {
        order[field] = order[field] && order[field] != '-1' ? 'asc' : 'desc'
        if (field.includes('.')) {
          const value = order[field]
          const subProps = field.split('.')
          const orderWithSubProps = {}
          subProps.reduce((acc, key, index) => {
            acc[key] = index === subProps.length - 1 ? value : {}
            return acc[key]
          }, orderWithSubProps)
          order = orderWithSubProps
        }
      }
    }

    if (!order) {
      return {}
    }
    return order
  }
  return {}
}
