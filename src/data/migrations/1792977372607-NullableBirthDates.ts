import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableBirthDates1792977372607 implements MigrationInterface {
  name = "NullableBirthDates1792977372607";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`birthMonth\` \`birthMonth\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`birthDay\` \`birthDay\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`birthDay\` \`birthDay\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`birthMonth\` \`birthMonth\` int NOT NULL`,
    );
  }
}
