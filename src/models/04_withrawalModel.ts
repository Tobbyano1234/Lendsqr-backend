exports.up = async (db: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => string };
  raw: (arg0: string) => string;
}) => {
  return db.schema.createTable("withdrawals", function (table) {
    table.uuid("id").primary();
    table.uuid("userId").index().references("id").inTable("users");
    table.uuid("accountId").index().references("id").inTable("accounts");
    table.string("bankName", 255).notNullable();
    table.string("accountName", 255).notNullable();
    table.string("email", 255).notNullable();
    table
      .string("accountNumber")
      .notNullable()
      // .checkRegex("[0-9]{8}")
      .checkLength("=", 10);
    table.integer("amount");
    table.string("status").defaultTo("pending");
    table.timestamp("created_at").defaultTo(db.raw("now()"));
    table.timestamp("updated_at").nullable();
    // table.timestamp("deleted").nullable();
  });
};

exports.down = async (db: {
  schema: { dropTable: (arg0: string) => string };
}) => {
  return db.schema.dropTable("withdrawals");
};
