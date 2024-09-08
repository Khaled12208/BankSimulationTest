const { test, expect } = require("@playwright/test");

test.describe("Send Money API", () => {
  test("should transfer money successfully", async ({ request }) => {
    const response = await request.post("/send-money", {
      data: { fromAccountId: "1234", toAccountId: "5678", amount: 200 },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Transfer successful");
    expect(responseBody.transactionId).not.toBeNull();
  });

  test("should return an error for negative transfer amount", async ({
    request,
  }) => {
    const response = await request.post("/send-money", {
      data: { fromAccountId: "1234", toAccountId: "5678", amount: -200 },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Transfer amount must be positive");
  });

  test("should return an error for zero transfer amount", async ({
    request,
  }) => {
    const response = await request.post("/send-money", {
      data: { fromAccountId: "1234", toAccountId: "5678", amount: 0 },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe(
      "Transfer amount must be greater than zero"
    );
  });
});
