import { MigrationInterface, QueryRunner } from "typeorm";

export class Bbb1708999592532 implements MigrationInterface {
    name = 'Bbb1708999592532'

    // 执行 migration:run 会执行上次的 migration 的 up 方法，并且从 migrations 表里增加执行记录。
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    // 执行 migration:revert 会执行上次的 migration 的 down 方法，并且从 migrations 表里删掉执行记录
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
