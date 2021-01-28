import {MigrationInterface, QueryRunner} from "typeorm";

export class V11611854251554 implements MigrationInterface {
    name = 'V11611854251554';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "leafs" double precision NOT NULL, "password" character varying NOT NULL, "roles" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_password_resets" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "userId" integer NOT NULL, "resetPasswordCode" character varying NOT NULL, "validUntil" bigint NOT NULL, CONSTRAINT "PK_1195936bd55065c8dfbfed4e4cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_password_resets" ADD CONSTRAINT "FK_2202b74b2057713a1cff9f7beca" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password_resets" DROP CONSTRAINT "FK_2202b74b2057713a1cff9f7beca"`);
        await queryRunner.query(`DROP TABLE "user_password_resets"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
