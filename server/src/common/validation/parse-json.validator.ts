import { Exception } from '../errors/Exception'
import { TransformFnParams } from 'class-transformer'

export function parseJson(obj: TransformFnParams) {
  const maxChar = 5000
  if (obj?.value?.length > maxChar) {
    return new Exception(`JSON ${obj?.key || ''} contains more than ${maxChar} chars`)
  }
  try {
    return obj.value ? JSON.parse(obj.value) : obj.value
  } catch (e) {
    return new Exception(`${obj?.key || ''} contains invalid JSON `)
  }
}
