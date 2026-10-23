import { MigrationInterface, QueryRunner } from "typeorm";

export class NewStats1792717123901 implements MigrationInterface {
  name = "NewStats1792717123901";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`goodnight\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`stat\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`stat\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`goodnight\``,
    );
  }
}
