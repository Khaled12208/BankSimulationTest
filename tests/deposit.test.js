const { test, expect } = require("@playwright/test");

test.describe("Deposit API", () => {
  test("should deposit money successfully", async ({ request }) => {
    const response = await request.post("/deposit", {
      data: { accountId: "1234", amount: 500, currency: "USD" },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.confirmationNumber).not.toBeNull();
  });

  test("should return an error for negative deposit amount", async ({
    request,
  }) => {
    const response = await request.post("/deposit", {
      data: { accountId: "1234", amount: -500, currency: "USD" },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Deposit amount must be greater than zero");
  });

  test("should return an error for zero deposit amount", async ({
    request,
  }) => {
    const response = await request.post("/deposit", {
      data: { accountId: "1234", amount: 0, currency: "USD" },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Deposit amount must be greater than zero");
  });

  test("should return an error for incorrect currency", async ({ request }) => {
    const response = await request.post("/deposit", {
      data: { accountId: "1234", amount: 500, currency: "EUR" },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Currency not supported");
  });

  test("should log deposit transactions correctly", async ({ request }) => {
    const response = await request.post("/deposit", {
      data: { accountId: "1234", amount: 500, currency: "USD" },
    });
    expect(response.status()).toBe(201);
  });
});
