const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth.js");
const { GraphQLScalarType } = require("graphql");
const { sort } = require("fast-sort");

const dateResolver = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toJSON();
  },
});

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You must be logged in!")
    }
  }
},
Mutation: {
  register: async (
    parent,
    { first_name, last_name, email, password, location }
  ) => {
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      location,
    });
    const token = signToken(user);
    return { token, user };
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError("No user with this email found!");
    }
    const correctPassword = await user.isCorrectPassword(password);
    if(!correctPassword) {
      throw new AuthenticationError("You have entered an incorrect password!");
    }
    const token = signToken(user);
    return { token, user };
  };
};

module.exports = resolvers;