const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

describe("auth Middleware", function () {
  it("should throw an error if no authorization header is presente", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get: () => {
        return "Bearer";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("Sould yield a userId after decoding the token", function () {
    const req = {
      get: () => {
        return "Bearer validToken";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it("Should throw an error if the token cannot be verified", function () {
    const req = {
      get: () => {
        return "Bearer invalidToken";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
