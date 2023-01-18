import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1674025845979 implements MigrationInterface {
    name = 'Initialize1674025845979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "color" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_d15e531d60a550fbf23e1832343" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "size" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_66e3a0111d969aa0e5f73855c7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" character varying NOT NULL, "quantity" integer NOT NULL, "basePrice" integer NOT NULL, "sellingPrice" integer NOT NULL, "colorId" integer, "sizeId" integer, CONSTRAINT "CHK_a3dd6588ba2e57a8133f0d2976" CHECK ("quantity" >= 0), CONSTRAINT "CHK_5e32c72dd1ac33497faa81d2a3" CHECK ("basePrice" >= 0), CONSTRAINT "CHK_9b4f7f00b924731a0ef5155a48" CHECK ("sellingPrice" >= 0), CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_646f2685fe07002ddfff1c5cb87" FOREIGN KEY ("colorId") REFERENCES "color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_83181384731b20fa47ac6b2accb" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_83181384731b20fa47ac6b2accb"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_646f2685fe07002ddfff1c5cb87"`);
        await queryRunner.query(`DROP TABLE "product_variant"`);
        await queryRunner.query(`DROP TABLE "size"`);
        await queryRunner.query(`DROP TABLE "color"`);
    }

}
