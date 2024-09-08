const { test, expect } = require("@playwright/test");

test.describe("Get Balance API", () => {
  test("should retrieve account balance successfully", async ({ request }) => {
    const response = await request.get("/balance", {
      params: { accountId: "1234" },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.balance).not.toBeNull();
  });

  test("should return an error for account not found", async ({ request }) => {
    const response = await request.get("/balance", {
      params: { accountId: "9999" },
    });
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Account not found");
  });

  test("should return an error for unauthorized access", async ({
    request,
  }) => {
    const response = await request.get("/balance", {
      params: { accountId: "12344564" },
      headers: { Authorization: "InvalidToken" },
    });
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Unauthorized access");
  });
});
