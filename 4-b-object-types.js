const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getDie(numSides: Int): RandomDie
  }

  type RandomDie  {
    roll(numRolls: Int!): [Int]
  }
`)

// Object type returned
const randomDie = {
    numSides: 6,
    // can not use arrow function here as this is not defined
    rollOnce: function(){ return (1 + Math.floor(Math.random() * this.numSides))},
    roll: function({ numRolls }) {     
        const output = []
        for (var i = 0; i < numRolls; i++) {
          output.push(this.rollOnce())
        }
        return output
      }
}

// The root provides a resolver function for each API endpoint
const root = {
  getDie: ({ numSides }) => {
       randomDie.numSides = numSides;
       return randomDie;
  }
}

const app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")