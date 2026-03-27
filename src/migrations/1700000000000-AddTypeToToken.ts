import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTypeToToken1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "token",
      new TableColumn({
        name: "type",
        type: "varchar",
        length: "20",
        isNullable: false,
        default: "'access'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("token", "type");
  }
}
