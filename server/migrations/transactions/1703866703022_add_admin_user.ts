import { Db } from "mongodb"
import { MigrationInterface } from "mongo-migrate-ts"
import { UserService } from "src/modules/user/services/user.service"
import { UserRepository } from "src/modules/user/repositories/user.repository"
import { PrismaService } from "src/database/prisma/prisma.service"
import { Role } from "src/modules/auth/enums/role.enum"

export class add_admin_user1703866703022 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const respository = new UserRepository(new PrismaService())
    const service = new UserService(respository)
    await service.createAdmin({
      email: "admin@admin.com",
      password: "admin!ADMIN123",
      passwordConfirm: "admin!ADMIN123",
      name: "Admin User",
      role: Role.ADMIN,
    } as any)
    await service.createAdmin({
      email: "master@master.com",
      password: "master!MASTER123",
      passwordConfirm: "master!MASTER123",
      name: "Master User",
      role: Role.ADMIN,
    } as any)
  }

  public async down(db: Db): Promise<any> {
    const respository = new UserRepository(new PrismaService())
    await respository.deleteMany({
      where: { email: "admin@admin.com" },
    })
    await respository.deleteMany({
      where: { email: "master@master.com" },
    })
  }
}
