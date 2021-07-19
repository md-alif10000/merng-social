const { ApolloServer } = require("apollo-server");
const typeDefs = require('./graphql/typeDefs')
const resolvers=require('./graphql/resolvers')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();







const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req})=>({req})
});


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
      console.log("Database is connected");
      server.listen({ port: 5000 }).then((res) => {
        console.log(`Server is running at ${res.url}`);
      });
  });


