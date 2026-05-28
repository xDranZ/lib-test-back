import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookCoverImageKey1780000000000
  implements MigrationInterface
{
  name = 'AddBookCoverImageKey1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ADD "cover_image_key" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "cover_image_key"`);
  }
}
