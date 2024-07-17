const { test, expect } = require("@playwright/test");
const {
  validateResponseSchema,
} = require("../validations/validateResponseSchema");

test.describe.configure({ mode: "serial" });
test.describe.only("Validate Dogs API", () => {
  let dogId;
  test("POST Dog - Success", async ({ request }) => {
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

  test("GET Dog - Success", async ({ request }) => {
    const response = await request.get(`http://127.0.0.1:2000/dogs/${dogId}`);
    await expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    validateResponseSchema(responseBody, "getResponse.json");
  });

  test("GET All Dogs - Success", async ({ request }) => {
    const response = await request.get(`http://127.0.0.1:2000/dogs`);
    await expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Delete Dog - Success", async ({ request }) => {
    const response = await request.delete(
      `http://127.0.0.1:2000/dogs/${dogId}`
    );
    await expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    validateResponseSchema(responseBody, "deleteResponse.json");
  });
});
