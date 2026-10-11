import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingDefaults1791728885321 implements MigrationInterface {
  name = "AddingDefaults1791728885321";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` CHANGE \`uses\` \`uses\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` CHANGE \`uses\` \`uses\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`cancels\` \`cancels\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`cat\` \`cat\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`cancel\` \`cancel\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`meme\` \`meme\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`meme\` CHANGE \`uses\` \`uses\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`meme\` CHANGE \`uses\` \`uses\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`meme\` \`meme\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`cancel\` \`cancel\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` CHANGE \`cat\` \`cat\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`cancels\` \`cancels\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` CHANGE \`uses\` \`uses\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` CHANGE \`uses\` \`uses\` int NOT NULL`,
    );
  }
}
