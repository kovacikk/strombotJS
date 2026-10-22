import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCommandAdd1792637000607 implements MigrationInterface {
  name = "UserCommandAdd1792637000607";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`daymeme\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`daymeme\``,
    );
  }
}
