import { MigrationInterface, QueryRunner } from "typeorm";

export class NewStat1792898347390 implements MigrationInterface {
  name = "NewStat1792898347390";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`pray\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`pray\``,
    );
  }
}
