const { gql } = require("apollo-server-express");

const typeDefs = gql`
scalar Date

type User {
  _id: ID
  first_name: String
  last_name: String
  email: String
  password: String
  location: String
}

type Auth {
  token: ID!
  user: User
}

type Query {
  user: User
}

type Mutation {
  register(
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    location: String!
  ): Auth
}
`;

module.exports = typeDefs;