import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1778112990097 implements MigrationInterface {
    name = 'InitialSchema1778112990097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "genre" character varying NOT NULL, "author" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "penalty_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "defaultAmount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cdc372d160c32f2436d3b4934c6" UNIQUE ("name"), CONSTRAINT "PK_6cd980eeb585aeba467a9afcc2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "penalties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paid_at" TIMESTAMP, "reason" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "penalty_type_id" uuid NOT NULL, CONSTRAINT "PK_c917b09222ad10103d984fc4e7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loans_status_enum" AS ENUM('active', 'returned', 'overdue')`);
        await queryRunner.query(`CREATE TABLE "loans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "delivery_code_hash" character varying NOT NULL, "delivery_confirmed_at" TIMESTAMP, "return_code_hash" character varying, "return_confirmed_at" TIMESTAMP, "due_date" date NOT NULL, "returned_at" TIMESTAMP, "status" "public"."loans_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "book_copy_id" uuid NOT NULL, "borrower_user_id" uuid NOT NULL, "loan_request_id" uuid, "penalty_id" uuid, CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "role" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."loan_requests_status_enum" AS ENUM('pending', 'approved', 'rejected', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "loan_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."loan_requests_status_enum" NOT NULL DEFAULT 'pending', "request_message" text NOT NULL, "response_message" text, "requested_at" TIMESTAMP NOT NULL DEFAULT now(), "responded_at" TIMESTAMP, "book_copy_id" uuid NOT NULL, "requester_user_id" uuid NOT NULL, CONSTRAINT "PK_52d5943f8adea74332d5d53ec6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."book_copies_status_enum" AS ENUM('available', 'loaned', 'inactive', 'damaged', 'loss')`);
        await queryRunner.query(`CREATE TABLE "book_copies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."book_copies_status_enum" NOT NULL DEFAULT 'available', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "book_id" uuid NOT NULL, "owner_user_id" uuid, CONSTRAINT "PK_f79606d3fd05df7dcce9542d438" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "penalties" ADD CONSTRAINT "FK_69f168d22cf0bd43bc0a95cc767" FOREIGN KEY ("penalty_type_id") REFERENCES "penalty_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_1917f4010a57eacc039552a9207" FOREIGN KEY ("book_copy_id") REFERENCES "book_copies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_ff30c3d51bb2413f150614ecf47" FOREIGN KEY ("borrower_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_d1c35c5ec51ec84c3e18347f4ed" FOREIGN KEY ("loan_request_id") REFERENCES "loan_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loans" ADD CONSTRAINT "FK_480e1a421b02e063267d1c459c9" FOREIGN KEY ("penalty_id") REFERENCES "penalties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan_requests" ADD CONSTRAINT "FK_92eddd81282d896919093336bf2" FOREIGN KEY ("book_copy_id") REFERENCES "book_copies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loan_requests" ADD CONSTRAINT "FK_5250da88984dbb5d1206cdbe529" FOREIGN KEY ("requester_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copies" ADD CONSTRAINT "FK_d8c3c9e0b8d41aa149ac58f23fe" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_copies" ADD CONSTRAINT "FK_d746cb4856ce2b9a76026d39d6a" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_copies" DROP CONSTRAINT "FK_d746cb4856ce2b9a76026d39d6a"`);
        await queryRunner.query(`ALTER TABLE "book_copies" DROP CONSTRAINT "FK_d8c3c9e0b8d41aa149ac58f23fe"`);
        await queryRunner.query(`ALTER TABLE "loan_requests" DROP CONSTRAINT "FK_5250da88984dbb5d1206cdbe529"`);
        await queryRunner.query(`ALTER TABLE "loan_requests" DROP CONSTRAINT "FK_92eddd81282d896919093336bf2"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_480e1a421b02e063267d1c459c9"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_d1c35c5ec51ec84c3e18347f4ed"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_ff30c3d51bb2413f150614ecf47"`);
        await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_1917f4010a57eacc039552a9207"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_69f168d22cf0bd43bc0a95cc767"`);
        await queryRunner.query(`ALTER TABLE "penalties" DROP CONSTRAINT "FK_e66d336be242cc6a462b3b3fbc5"`);
        await queryRunner.query(`DROP TABLE "book_copies"`);
        await queryRunner.query(`DROP TYPE "public"."book_copies_status_enum"`);
        await queryRunner.query(`DROP TABLE "loan_requests"`);
        await queryRunner.query(`DROP TYPE "public"."loan_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "loans"`);
        await queryRunner.query(`DROP TYPE "public"."loans_status_enum"`);
        await queryRunner.query(`DROP TABLE "penalties"`);
        await queryRunner.query(`DROP TABLE "penalty_types"`);
        await queryRunner.query(`DROP TABLE "books"`);
    }

}
