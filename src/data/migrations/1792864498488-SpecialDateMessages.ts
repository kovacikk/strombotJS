import { MigrationInterface, QueryRunner } from "typeorm";

export class SpecialDateMessages1792864498488 implements MigrationInterface {
  name = "SpecialDateMessages1792864498488";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`special_date\` ADD \`message\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`special_date\` DROP COLUMN \`message\``,
    );
  }
}
