const { defineConfig } = require("prisma");

module.exports = defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
