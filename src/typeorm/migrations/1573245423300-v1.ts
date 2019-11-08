import {MigrationInterface, QueryRunner} from 'typeorm';

export class v11573245423300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isActive` tinyint NOT NULL DEFAULT 1, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `roles` varchar(255) NOT NULL, UNIQUE INDEX `IDX_415c35b9b3b6fe45a3b065030f` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP INDEX `IDX_415c35b9b3b6fe45a3b065030f` ON `user_entity`', undefined);
        await queryRunner.query('DROP TABLE `user_entity`', undefined);
    }

}
