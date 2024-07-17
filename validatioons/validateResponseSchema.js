const chai = require("chai");
chai.use(require("chai-json-schema"));
var expectChai = chai.expect;

function validateResponseSchema(body, filePath) {
  const schema = require(`../test-data/schemas/${filePath}`);
  expectChai(body).to.be.jsonSchema(schema);
}

export { validateResponseSchema };
