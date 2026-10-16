import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCommands1792118982538 implements MigrationInterface {
  name = "UserCommands1792118982538";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`bulborb\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP FOREIGN KEY \`FK_0caeaa1a853f5628bb893601cbd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`user_id\` varchar(255) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD CONSTRAINT \`FK_0caeaa1a853f5628bb893601cbd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP FOREIGN KEY \`FK_0caeaa1a853f5628bb893601cbd\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD PRIMARY KEY (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD CONSTRAINT \`FK_0caeaa1a853f5628bb893601cbd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP COLUMN \`bulborb\``,
    );
  }
}
