const { test, expect } = require("@playwright/test");

test.describe("Withdraw API", () => {
  test("should withdraw money successfully", async ({ request }) => {
    const response = await request.post("/withdraw", {
      data: { accountId: "1234", amount: 100 },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Withdrawal successful");
    expect(responseBody.transactionId).not.toBeNull();
    expect(responseBody.newBalance).not.toBeNull();
  });

  test("should return an error for insufficient funds", async ({ request }) => {
    const response = await request.post("/withdraw", {
      data: { accountId: "1234", amount: 1000 },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Insufficient funds");
  });

  test("should return an error for negative withdrawal amount", async ({
    request,
  }) => {
    const response = await request.post("/withdraw", {
      data: { accountId: "1234", amount: -100 },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Withdrawal amount must be positive");
  });

  test("should return an error for zero withdrawal amount", async ({
    request,
  }) => {
    const response = await request.post("/withdraw", {
      data: { accountId: "1234", amount: 0 },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe(
      "Withdrawal amount must be greater than zero"
    );
  });
});
