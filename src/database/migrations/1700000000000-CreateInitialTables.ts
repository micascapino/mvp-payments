import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1700000000000 implements MigrationInterface {
    name = 'CreateInitialTables1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."client_role_enum" AS ENUM('admin', 'user')
        `);

        await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" SERIAL NOT NULL,
                "client_id" character varying NOT NULL,
                "hashed_secret" character varying NOT NULL,
                "role" "public"."client_role_enum" NOT NULL DEFAULT 'user',
                "is_active" boolean NOT NULL DEFAULT true,
                "email" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_clients_client_id" UNIQUE ("client_id"),
                CONSTRAINT "PK_clients" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "balance" decimal(10,2) NOT NULL DEFAULT '0',
                "client_id" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_accounts_email" UNIQUE ("email"),
                CONSTRAINT "PK_accounts" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'COMPLETED', 'REJECTED', 'FAILED')
        `);

        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "origin_account_id" uuid NOT NULL,
                "destiny_account_id" uuid NOT NULL,
                "amount" decimal(12,2) NOT NULL,
                "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_transactions" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "accounts" 
            ADD CONSTRAINT "FK_accounts_client_id" 
            FOREIGN KEY ("client_id") REFERENCES "clients"("client_id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD CONSTRAINT "FK_transactions_origin_account_id" 
            FOREIGN KEY ("origin_account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD CONSTRAINT "FK_transactions_destiny_account_id" 
            FOREIGN KEY ("destiny_account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_accounts_client_id" ON "accounts" ("client_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_origin_account_id" ON "transactions" ("origin_account_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_destiny_account_id" ON "transactions" ("destiny_account_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_created_at" ON "transactions" ("created_at")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_transactions_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_status"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_destiny_account_id"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_origin_account_id"`);
        await queryRunner.query(`DROP INDEX "IDX_accounts_client_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_destiny_account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_origin_account_id"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_accounts_client_id"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TYPE "public"."client_role_enum"`);
    }
} 