import { MigrationInterface, QueryRunner } from "typeorm";

export class NewUploadStat1792812554423 implements MigrationInterface {
  name = "NewUploadStat1792812554423";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`upload\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`upload\``,
    );
  }
}
