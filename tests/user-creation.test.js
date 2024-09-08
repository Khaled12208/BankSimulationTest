const { test, expect } = require("@playwright/test");

test.describe("User Creation API", () => {
  test("should create a user successfully", async ({ request }) => {
    const response = await request.post("/user", {
      data: {
        username: "new_user",
        password: "Password123",
        dob: "1990-01-01",
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("User created successfully");
    expect(responseBody.userId).not.toBeNull();
  });

  test("should return an error for duplicate username", async ({ request }) => {
    const response = await request.post("/user", {
      data: {
        username: "existing_user",
        password: "Password123",
        dob: "1990-01-01",
      },
    });
    expect(response.status()).toBe(409);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("User already exists");
  });

  test("should return an error for invalid username", async ({ request }) => {
    const response = await request.post("/user", {
      data: { username: "", password: "Password123", dob: "1990-01-01" },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Invalid username");
  });

  test("should return an error for password limits violation", async ({
    request,
  }) => {
    const response = await request.post("/user", {
      data: { username: "valid_user", password: "short", dob: "1990-01-01" },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Password must be more than 10 characters");
  });

  test("should return an error for invalid date of birth", async ({
    request,
  }) => {
    const response = await request.post("/user", {
      data: {
        username: "valid_user",
        password: "Password123",
        dob: "2050-01-01",
      },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe("Invalid date of birth");
  });
});
