import { MigrationInterface, QueryRunner } from "typeorm";

export class PrayFields1792892084754 implements MigrationInterface {
  name = "PrayFields1792892084754";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`devotion\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`last_prayer\` timestamp NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`last_prayer\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`devotion\``);
  }
}
