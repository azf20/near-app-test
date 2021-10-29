import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const subgraphUri =
  "https://api.thegraph.com/subgraphs/name/azf20/good-morning-near";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache()
});

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App />,
      </ApolloProvider>,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
