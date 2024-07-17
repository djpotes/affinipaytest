const { test, expect } = require("@playwright/test");
const {
  validateResponseSchema,
} = require("../validations/validateResponseSchema");

test.describe.configure({ mode: "serial" });
test.describe.only("Validate Post Dog", () => {
  let dogId;
  test("Success", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: "Poddle",
        age: 2,
        name: "Mateo",
      },
    });
    await expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    await validateResponseSchema(responseBody, "postResponse.json");
    dogId = responseBody.id;
  });

  test("Missing Breed", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        age: 2,
        name: "Mateo",
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(500);
  });

  test("Missing Age", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: "Poddle",
        name: "Mateo",
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(500);
  });

  test("Missing Name", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: "Poddle",
        age: 2,
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(500);
  });

  test("Invalid Breed", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: 1,
        age: 2,
        name: "Mateo",
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
  });

  test("Invalid Age", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        age: "sds",
        breed: "Poddle",
        name: "Mateo",
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
  });

  test("Invalid Name", async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: "Poddle",
        age: 2,
        name: true,
      },
    });
    await expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
  });

  test.afterAll(async ({ request }) => {
    await request.delete(`http://127.0.0.1:2000/dogs/${dogId}`);
  });
});
