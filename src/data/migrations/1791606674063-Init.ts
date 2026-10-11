import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1791606674063 implements MigrationInterface {
  name = "Init1791606674063";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bulborb\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`uses\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`meme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`uses\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`uses\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`birthday\` date NULL, \`cancels\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_command_stats\` (\`user_id\` int NOT NULL, \`cat\` int NOT NULL, \`cancel\` int NOT NULL, \`meme\` int NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` ADD CONSTRAINT \`FK_0caeaa1a853f5628bb893601cbd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_command_stats\` DROP FOREIGN KEY \`FK_0caeaa1a853f5628bb893601cbd\``,
    );
    await queryRunner.query(`DROP TABLE \`user_command_stats\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`cat\``);
    await queryRunner.query(`DROP TABLE \`meme\``);
    await queryRunner.query(`DROP TABLE \`bulborb\``);
  }
}
