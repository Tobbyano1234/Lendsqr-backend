exports.up = async (db: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => string };
  raw: (arg0: string) => string;
}) => {
  return db.schema.createTable("accounts", function (table) {
    table.uuid("id").primary();
    table.uuid("userId").index().references("id").inTable("users");
    table.string("bankName", 255).notNullable();
    table.string("accountName", 255).notNullable();
    table
      .string("accountNumber")
      .unique()
      .notNullable()
      // .checkRegex("[0-9]{8}")
      .checkLength("=", 10);
    table.integer("walletBalance");
    table.timestamp("created_at").defaultTo(db.raw("now()"));
    table.timestamp("updated_at").nullable();
    // table.timestamp("deleted").nullable();
  });
};

exports.down = async (db: {
  schema: { dropTable: (arg0: string) => string };
}) => {
  return db.schema.dropTable("accounts");
};
