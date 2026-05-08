import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPasswordHash1778113619199 implements MigrationInterface {
    name = 'AddUserPasswordHash1778113619199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying`);
        await queryRunner.query(`UPDATE "users" SET "password_hash" = '00:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' WHERE "password_hash" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    }

}
