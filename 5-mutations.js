const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
} 

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getMessage(id: ID!): Message
    allMessage: [MessageDto]
  }

  type Mutation  {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type MessageDto {
    content: String
    author: String
  }

  input MessageInput {
    content: String
    author: String
  }
`)

let fakeDatabase = {};

// The root provides a resolver function for each API endpoint
const root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
        return "message not found";
    }
    return {
        id,
        ...fakeDatabase[id]
    }
  },
  allMessage: () => {

    const resp = [...Object.values(fakeDatabase)]
    return resp;
  },
  createMessage: ({ input }) => {
    const id = crypto.randomBytes(10).toString("hex");
    fakeDatabase[id] = {
        content: input.content,
        author: input.author
    }
    return { 
        id,
        content: input.content,
        author: input.author 
    };
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
        return "message could not be updated";
    }
    fakeDatabase[id] = {
        content: input.content,
        author: input.author
    }
    return "message updated";
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