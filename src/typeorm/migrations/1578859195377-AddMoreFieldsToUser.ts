import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreFieldsToUser1578859195377 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user_entity` ADD `phone` varchar(255) NULL', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` ADD `googleIdToken` varchar(255) NULL', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` ADD UNIQUE INDEX `IDX_8233d7f71cdf98590321f30f78` (`googleIdToken`)', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` ADD `facebookIdToken` varchar(255) NULL', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` ADD UNIQUE INDEX `IDX_c7c6c275421c1d8244d05e3b14` (`facebookIdToken`)', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user_entity` DROP INDEX `IDX_c7c6c275421c1d8244d05e3b14`', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` DROP COLUMN `facebookIdToken`', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` DROP INDEX `IDX_8233d7f71cdf98590321f30f78`', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` DROP COLUMN `googleIdToken`', undefined);
    await queryRunner.query('ALTER TABLE `user_entity` DROP COLUMN `phone`', undefined);
  }

}
