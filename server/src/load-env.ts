// Carrega as variáveis de ambiente
import * as dotenv from 'dotenv'
export function loadEnv() {
  dotenv.config({ path: '.env' })
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
  dotenv.config({ path: envFile, override: true })
  dotenv.config({ path: '.env.local', override: true })
}
//
