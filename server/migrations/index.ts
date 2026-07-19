import { loadEnv } from "src/load-env"
loadEnv()
import { mongoMigrateCli } from "mongo-migrate-ts"
mongoMigrateCli({
  uri: process.env.DATABASE_URL,
  migrationsDir: "dist/migrations/transactions",
  migrationsCollection: "migrations_changelog",
})
