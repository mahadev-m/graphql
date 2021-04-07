import React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Get_data } from "./queries";

function App({ launches }) {
  console.log("launches", launches);
  return (
    <div>
      {launches.map((launch) => {
        return (
          <a key={launch.id} href={launch.links.video_link}>
            <h3>{launch.mission_name}</h3>
            <p>
              <strong>Launch Date:</strong>{" "}
              {new Date(launch.launch_date_local).toLocaleDateString("en-US")}
            </p>
          </a>
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: process.env.GRAPH_QL_API,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: Get_data,
  });

  return {
    props: {
      launches: data.launchesPast,
    },
  };
}

export default App;
