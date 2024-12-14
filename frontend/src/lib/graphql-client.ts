import { GraphQLClient } from "graphql-request";

export const graphQlClient = new GraphQLClient(
  "http://localhost:3000/api/graphql"
);
