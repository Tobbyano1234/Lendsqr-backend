exports.up = async (db: {
  schema: { createTable: (arg0: string, arg1: (table: any) => void) => string };
  raw: (arg0: string) => string;
}) => {
  return db.schema.createTable("users", function (table) {
    table.uuid("id").primary();
    table.string("firstName", 255).notNullable();
    table.string("lastName", 255).notNullable();
    table.date("dob").notNullable();
    table.enu("gender", ["male", "female"]).notNullable();
    table.string("email").index().unique().notNullable();
    table.string("bvn").index().unique().notNullable();
    table
      .string("phoneNumber")
      .unique()
      .notNullable()
      // .checkRegex("[0-9]{8}")
      .checkLength("=", 11);
    table.string("address").defaultTo("").nullable();
    table.string("avatar");
    table.string("password").notNullable();
    table.boolean("isVerified").defaultTo(false);
    table.integer("wallet");
    table.timestamp("created_at").defaultTo(db.raw("now()"));
    table.timestamp("updated_at").nullable();
    // table.timestamp("deleted").nullable();
  });
};

exports.down = async (db: {
  schema: { dropTable: (arg0: string) => string };
}) => {
  return db.schema.dropTable("users");
};
