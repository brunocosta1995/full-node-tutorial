const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const FeedController = require("../controllers/feed");
const mongoose = require("mongoose");
const io = require("../socket");

describe("Feed Controller", function () {
  before(async function () {
    await mongoose.connect(
      "mongodb+srv://Node-Course:1234@cluster0.4jrso.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0"
    );
    const user = new User({
      email: "teste@teste.com",
      password: "tester",
      name: "Tester",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });
    await user.save();
  });

  it("should add a created post to the posts of the creator", async function () {
    const ioStub = sinon.stub(io, "getIO").returns({ emit: sinon.spy() });
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post Content",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      statusCode: null,
      payload: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.payload = data;
        return this;
      },
    };

    const savedUser = await FeedController.createPost(req, res, () => {});

    expect(res.statusCode).to.equal(201);
    expect(res.payload).to.have.property(
      "message",
      "Post created successfully!"
    );

    expect(savedUser).to.be.an("object");
    expect(savedUser).to.have.property("posts");
    expect(savedUser.posts).to.have.length(1);
  });

  after(async function () {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
