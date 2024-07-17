const { test, expect } = require("@playwright/test");
const {
  validateResponseSchema,
} = require("../validations/validateResponseSchema");

test.describe.configure({ mode: "serial" });
test.describe.only("Validate Get Dog", () => {
  let dogId;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`http://127.0.0.1:2000/dogs`, {
      data: {
        breed: "Poddle",
        age: 2,
        name: "Mateo",
      },
    });
    let responseBody = await response.json();
    dogId = responseBody.id;
  });

  test("Success", async ({ request }) => {
    const response = await request.get(`http://127.0.0.1:2000/dogs/${dogId}`);
    await expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    validateResponseSchema(responseBody, "getResponse.json");
  });

  test.afterAll(async ({ request }) => {
    await request.delete(`http://127.0.0.1:2000/dogs/${dogId}`);
  });
});
