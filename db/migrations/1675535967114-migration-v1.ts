import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrationV11675535967114 implements MigrationInterface {
  name = 'migrationV11675535967114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" text NOT NULL, "password" text, "is_active" boolean NOT NULL DEFAULT (0), "is_google_account" boolean NOT NULL, "activation_token" varchar, "reset_password_token" varchar, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_89a1c9adfee558c580dd8a2b6aa" UNIQUE ("activation_token"), CONSTRAINT "UQ_ee6419219542371563e0592db51" UNIQUE ("reset_password_token"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100) NOT NULL, "description" varchar(200), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" text NOT NULL, "password" text, "is_active" boolean NOT NULL DEFAULT (0), "is_google_account" boolean NOT NULL, "activation_token" varchar, "reset_password_token" varchar, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_89a1c9adfee558c580dd8a2b6aa" UNIQUE ("activation_token"), CONSTRAINT "UQ_ee6419219542371563e0592db51" UNIQUE ("reset_password_token"), CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users"("id", "username", "email", "password", "is_active", "is_google_account", "activation_token", "reset_password_token", "role_id") SELECT "id", "username", "email", "password", "is_active", "is_google_account", "activation_token", "reset_password_token", "role_id" FROM "users"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" text NOT NULL, "password" text, "is_active" boolean NOT NULL DEFAULT (0), "is_google_account" boolean NOT NULL, "activation_token" varchar, "reset_password_token" varchar, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_89a1c9adfee558c580dd8a2b6aa" UNIQUE ("activation_token"), CONSTRAINT "UQ_ee6419219542371563e0592db51" UNIQUE ("reset_password_token"))`,
    );
    await queryRunner.query(
      `INSERT INTO "users"("id", "username", "email", "password", "is_active", "is_google_account", "activation_token", "reset_password_token", "role_id") SELECT "id", "username", "email", "password", "is_active", "is_google_account", "activation_token", "reset_password_token", "role_id" FROM "temporary_users"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
