import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagColumn1720861047603 implements MigrationInterface {
    name = 'AddTagColumn1720861047603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` ADD \`tag\` varchar(30) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP COLUMN \`tag\``);
    }

}
