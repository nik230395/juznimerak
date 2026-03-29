import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

export default defineConfig({
  migrate: {
    adapter: async () => {
      const url = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      if (!url) throw new Error("TURSO_DATABASE_URL is not set");
      return new PrismaLibSql({ url, authToken });
    },
  },
});
