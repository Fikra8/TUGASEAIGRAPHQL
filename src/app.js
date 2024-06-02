const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/database');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 8000 }, () =>
    console.log(`Server ready at http://localhost:8000${server.graphqlPath}`)
  );

  // Synchronize all defined models to the DB
  await sequelize.sync();
}

startServer();