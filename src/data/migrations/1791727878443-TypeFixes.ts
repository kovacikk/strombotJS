import { MigrationInterface, QueryRunner } from "typeorm";

export class TypeFixes1791727878443 implements MigrationInterface {
  name = "TypeFixes1791727878443";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bulborb\` DROP COLUMN \`uses\``);
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` ADD \`uses\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`meme\` DROP COLUMN \`uses\``);
    await queryRunner.query(`ALTER TABLE \`meme\` ADD \`uses\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`cat\` DROP COLUMN \`uses\``);
    await queryRunner.query(`ALTER TABLE \`cat\` ADD \`uses\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`cat\` DROP COLUMN \`uses\``);
    await queryRunner.query(
      `ALTER TABLE \`cat\` ADD \`uses\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`meme\` DROP COLUMN \`uses\``);
    await queryRunner.query(
      `ALTER TABLE \`meme\` ADD \`uses\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`bulborb\` DROP COLUMN \`uses\``);
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` ADD \`uses\` varchar(255) NOT NULL`,
    );
  }
}
