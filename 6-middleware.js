const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

const schema = buildSchema(`
  type Query {
    x: String
  }
`)

const loggingMiddleware = (req, res, next) => {
  req.x = "Mark";
  console.log("middleware called");
  next()
}

const root = {
  x: function (args, request) {
    return request.x
  },
}

const app = express()
app.use(loggingMiddleware)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at localhost:4000/graphql")