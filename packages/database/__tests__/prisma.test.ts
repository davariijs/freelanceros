import { prisma } from "../index";

describe("Database Client Integration Spec", () => {
  it("should import the prisma singleton client successfully", () => {
    expect(prisma).toBeDefined();
    expect(prisma.user).toBeDefined();
    expect(prisma.task).toBeDefined();
    expect(prisma.project).toBeDefined();
  });
});
