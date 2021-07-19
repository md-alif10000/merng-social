const postResolvers = require('./posts')
const userResolvers = require("./users");

module.exports = {
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation
  },
};