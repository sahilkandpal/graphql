const express = require("express");
const app = express();
const data = require("./data");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const itemType = new GraphQLObjectType({
  name: "Item",
  description: "FoodItem",
  fields: {
    _id: { type: GraphQLInt },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
  },
});

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  description: "This is the root query",
  fields: {
    items: { type: new GraphQLList(itemType), resolve: () => data },
    item: {
      type: itemType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, { id }) => data.find((item) => item._id == id),
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  description: "This is the root Mutation",
  fields: {
    item: {
      type: itemType,
      args: {
        name: { type: GraphQLString },
        cat: { type: GraphQLString },
        price: { type: GraphQLInt },
      },
      resolve: (_, { name, cat, price }) => {
        const newItem = { _id: data.length + 1, name, category: cat, price };
        data.concat(newItem);
        console.log(newItem);
        return newItem;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: rootQuery, mutation: rootMutation });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = 8000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
