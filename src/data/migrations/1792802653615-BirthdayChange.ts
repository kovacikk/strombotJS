import { MigrationInterface, QueryRunner } from "typeorm";

export class BirthdayChange1792802653615 implements MigrationInterface {
  name = "BirthdayChange1792802653615";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`birthday\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`birthMonth\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`birthDay\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`birthDay\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`birthMonth\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`birthday\` date NULL`);
  }
}
