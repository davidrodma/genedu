import { Db, MongoClient, ObjectId } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts'
const titleGroup = 'Limits'
const nameConfig = 'limit-proxy'

export class Migration1700235911833 implements MigrationInterface {
  public async up(db: Db, client: MongoClient): Promise<any> {
    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        const group = await db
          .collection('ConfigGroup')
          .insertOne({ title: titleGroup, status: 1, createdAt: new Date(), updatedAt: new Date() })

        await db.collection('Config').insertOne({
          _id: new ObjectId('608822330e90a9226cb2759c'),
          configGroupId: group.insertedId,
          value: '1',
          classAdd: '',
          status: 1,
          name: nameConfig,
          title: 'Nº Limite de Proxy',
          description:
            "Quantidade limite de proxy sequencial no login.",
          type: 'text',
          createdAt: new Date('2021-04-27T14:39:47.686Z'),
          updatedAt: new Date('2021-04-27T14:39:47.686Z'),
        })
      })
    } finally {
      await session.endSession()
    }
  }

  public async down(db: Db, client: MongoClient): Promise<any> {
    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        await db.collection('Config').deleteOne({ name: nameConfig })
        await db.collection('ConfigGroup').deleteOne({ title: titleGroup })
      })
    } finally {
      await session.endSession()
    }
  }
}
