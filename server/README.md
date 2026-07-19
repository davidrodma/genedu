<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Nest: A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
   
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript with Prisma + MongoDB.

## 1 Installation - Packages

Ensure that Node and Yarn are installed on your machine before running the next command.

```bash
$ yarn install
```

## 1.1 Installation - Main Files Configurations

All: [`.env`](.env)

Development: [`.env.development`](.env.development)

Production: [`.env.prodution`](.env.production)

## 2 Datatabase - Installation MongoDB

In this project, the MongoDB database was used.

- Install [MongoDB](https://docs.mongodb.com/):

## 2.1 Datatabase - Replica Set MongoDB

Prisma requires that you have mongodb database replication for your NestJs application. Then proceed as follows, before start your project:

- **2.1.1** Edit Config:

  Linux: [`/etc/mongod.conf`](/etc/mongod.conf)

  Windows: [`C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`]()

- **2.1.2** Uncomment and add the following line, pay attention to Python-like indentation:

```python
replication:
  replSetName: rs0 # Replace with a meaningful name for your replica set
```

- **2.1.3** Restart the mongod service

- **2.1.4** Environment variable

  Windows, Only:

  - Create an environment variable below if there is non as below, then restart your shell:

  ```bash
    $  setx PATH "%PATH%;C:\Program Files\MongoDB\Server\7.0\bin"
  ```

- **2.1.5** Open mongosh

  - Windows, Install [mongosh](https://www.mongodb.com/docs/mongodb-shell/) and run:

  ```bash
  $ mongosh
  ```

  - Linux, run:

  ```bash
  $ mongosh --port 26018 -u topSmm -p --authenticationDatabase topsmm #example of accessing a port other than the default 27017
  ```

- **2.1.6** Run inside the mongosh shell:

  ```bash
    > use admin;
    > rs.initiate();
    > exit();  #If everything is ok, leave
  ```

- **2.1.7** FAILS, ONLY:

  ONLY if rs.initiate() fails:

  ```bash
    > rs.initiate(
   {
      _id: "rs0",
      members: [
         { _id: 1, host : "localhost:26018" },
         { _id: 1, host : "localhost:26028" },
         { _id: 1, host : "localhost:26038" },
      ]
   } )
  ```

  ONLY, if the stick continues:

  ```bash
    > rs.add({host: "localhost:26018", priority: 0, votes: 0})
  ```

  ONLY and if it still fails, try using the **rs.status()** or **rs.config()** commands to obtain information about the replica members with their hosts. ports and their ids. With this information, try to fix it using an example below:

  ```bash
   > rs.reconfig(
    {
      _id: "rs0",
      members: [
        { _id: 0, host: "localhost:27017" },
        { _id: 1, host: "localhost:26018" },
        { _id: 2, host: "localhost:26028" },
        { _id: 3, host: "localhost:26038" }
      ]
    },{force:true})
  ```

  To avoid failure, try not to repeat hosts with a port for the same \_id, so you avoid making a mistake right at the beginning, otherwise you will have to keep adjusting. Always consult rs.status(), if it is not working, you may have to return to the default settings in `/etc/mongod.conf` , such as port 27017.

- **2.1.8** Go back to the system bash, and add new members to the replica set:

  - Linux:

  ```bash
  $ mongod --replSet rs0 --port 26028 --dbpath /var/www/mongod/db0
  $ mongod --replSet rs0 --port 26038 --dbpath /var/www/mongod/db1
  ```

  - Windows:

  ```bash
  $ mongod --port 27027 --replSet rs0 --dbpath="C:\data\db1"
  $ mongod --port 27037 --replSet rs0 --dbpath="C:\data\db2"
  ```

- **2.1.9** Add 2 instances to replica set using rs.add() within mongosh (see 2.1.5):

  ```bash
    > rs.add( { host: "127.0.0.1:27027", priority: 0, votes: 0 } )
    > rs.add( { host: "127.0.0.1:27037", priority: 0, votes: 0 } )
  ```

- **2.1.10** Check replica set status no mongosh

  ```bash
  > rs.status();
  > exit(); #If everything is ok, leave
  ```

## 2.2 Datatabase - File Schema

Database schema structure file::

[`prisma/schema.prisma`](prisma/schema.prisma)

## 2.3 Database - Default Migration

```bash
# MongoDB (Run every time you change the Schema)
$ yarn prisma generate
$ yarn generate #Facilitator Package Script
$ yarn generate:prod #Production: Facilitator Package Script

#-------- WARNING --------
#MongoDB: ONLY THE FIRST TIME If not, DELETE the database (DANGER):
$ yarn prisma db push
$ yarn prisma:db:push:prod #Production: Facilitator Package Script


# SQL (only example): if it was a sql database:
#$ npx prisma migrate dev --name init
```

## 2.4 Database - mongo-migrations

mongo-migrate external package for migration, it is necessary because Mongodb does not have migration in Prisma:

Config Migration mongo-migrations:
[`migrations.json`](migrations.json)

```bash

# Examples Commands:
# $ yarn mongo-migrate new -n
# $ yarn mongo-migrate up
# $ yarn mongo-migrate down -l

#The previous examples commands only work with compiled javascript, so use these shortcuts below package.json scripts to run these same commands:

#only if the migrations.json configuration not exists
$ yarn mongo-migrate init

#create migration
$ yarn mongo-migrate:new name_migration

#run the migration
$ yarn mongo-migrate:up
$ yarn mongo-migrate:up:prod #PRODUCTION

#rollback the migration
$ yarn mongo-migrate:down
$ yarn mongo-migrate:down:prod #PRODUCTION
```

## 3. Running the app

```bash
# start
$ yarn run start

# development watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod


#​A bot node server has been created that will listen and execute infinite loop operations pending on the queued and asynchronous backend.
#-----------------------------------------------------------------------
# backend bot start
$ yarn run bot:start

# backend bot development watch mode
$ yarn run bot:dev

# production mode
$ yarn run bot:prod
```

- 3.1 Failed to run the start:

  - Run the command below if you get an Error "Could not load the "sharp" module using the win32-x64 runtime":

  ```bash
  yarn add sharp --ignore-engines
  ```

- 3.2 Run Rest API tests in Insomnia:
  - Import into Insomnia: [`_docs/insomnia-rest.json`](insomnia-rest.json)

## Developer

- Author - [David Rodma](https://github.com/davidrodma/)

## License

Nest is [MIT licensed](LICENSE).
