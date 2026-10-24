import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueColumns1792861457555 implements MigrationInterface {
  name = "UniqueColumns1792861457555";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` ADD UNIQUE INDEX \`IDX_a0e9f5d7e88d327ca3a1a6f8f3\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` ADD UNIQUE INDEX \`IDX_a283cfea382b9fe3be41aa7cd6\` (\`path\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` ADD UNIQUE INDEX \`IDX_aad5842554387ee4ac802df41a\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` ADD UNIQUE INDEX \`IDX_f5a83af836519eee2ba80b3b6b\` (\`path\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`special_date\` ADD UNIQUE INDEX \`IDX_7c7bdb0eb5419288b96ad0d821\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`special_date\` ADD UNIQUE INDEX \`IDX_565c0a8764887700c3a6fa5796\` (\`path\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`day_meme\` ADD UNIQUE INDEX \`IDX_17c889e622d1ed9e120a0bd7dd\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`day_meme\` ADD UNIQUE INDEX \`IDX_9bcf58e867698903625a30b301\` (\`path\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`meme\` ADD UNIQUE INDEX \`IDX_25e9f76511c21bf5ff3ba78175\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`meme\` ADD UNIQUE INDEX \`IDX_a24e31ff663f3c2c41bcba5a03\` (\`path\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`weevil\` ADD UNIQUE INDEX \`IDX_5e9f357325e2395c3c513e6b38\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`weevil\` ADD UNIQUE INDEX \`IDX_2a495e894c5de7d2b659681263\` (\`path\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`weevil\` DROP INDEX \`IDX_2a495e894c5de7d2b659681263\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`weevil\` DROP INDEX \`IDX_5e9f357325e2395c3c513e6b38\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`meme\` DROP INDEX \`IDX_a24e31ff663f3c2c41bcba5a03\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`meme\` DROP INDEX \`IDX_25e9f76511c21bf5ff3ba78175\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`day_meme\` DROP INDEX \`IDX_9bcf58e867698903625a30b301\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`day_meme\` DROP INDEX \`IDX_17c889e622d1ed9e120a0bd7dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`special_date\` DROP INDEX \`IDX_565c0a8764887700c3a6fa5796\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`special_date\` DROP INDEX \`IDX_7c7bdb0eb5419288b96ad0d821\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` DROP INDEX \`IDX_f5a83af836519eee2ba80b3b6b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cat\` DROP INDEX \`IDX_aad5842554387ee4ac802df41a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` DROP INDEX \`IDX_a283cfea382b9fe3be41aa7cd6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulborb\` DROP INDEX \`IDX_a0e9f5d7e88d327ca3a1a6f8f3\``,
    );
  }
}
